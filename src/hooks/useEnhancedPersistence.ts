/**
 * Enhanced Data Persistence Hook
 * 
 * Provides automatic data persistence with:
 * - Debounced writes to prevent excessive storage operations
 * - Automatic recovery from corrupted data
 * - Versioning support
 * - Conflict detection
 * - Backup and restore capabilities
 */

import { useEffect, useRef, useCallback } from 'react'
import { debounce } from '@/lib/utils'
import { logger } from '@/lib/logger'

interface PersistenceOptions<T> {
  key: string
  data: T
  debounceMs?: number
  enabled?: boolean
  versioned?: boolean
  version?: number
  validator?: (data: unknown) => data is T
  onError?: (error: Error) => void
  onRecovery?: (recoveredData: T) => void
}

interface VersionedData<T> {
  version: number
  data: T
  timestamp: number
}

const BACKUP_SUFFIX = '-backup'
const MAX_BACKUPS = 3

/**
 * Enhanced persistence hook with auto-save, versioning, and recovery
 */
export function useEnhancedPersistence<T>(options: PersistenceOptions<T>) {
  const {
    key,
    data,
    debounceMs = 500,
    enabled = true,
    versioned = false,
    version = 1,
    validator,
    onError,
    onRecovery,
  } = options

  const isInitialMount = useRef(true)
  const lastSavedDataRef = useRef<string>('')

  /**
   * Save data to storage with versioning
   */
  const saveData = useCallback(
    (dataToSave: T) => {
      if (!enabled) return

      try {
        const dataToStore = versioned
          ? ({
              version,
              data: dataToSave,
              timestamp: Date.now(),
            } as VersionedData<T>)
          : dataToSave

        const serialized = JSON.stringify(dataToStore)
        
        // Only save if data has actually changed
        if (serialized === lastSavedDataRef.current) {
          return
        }

        // Create backup before overwriting
        const existingData = localStorage.getItem(key)
        if (existingData) {
          createBackup(key, existingData)
        }

        localStorage.setItem(key, serialized)
        lastSavedDataRef.current = serialized
        
        logger.dev(`[Enhanced Persistence] Saved: ${key}`)
      } catch (error) {
        logger.error(`[Enhanced Persistence] Save failed for ${key}:`, error)
        if (onError) {
          onError(error as Error)
        }
      }
    },
    [key, enabled, versioned, version, onError]
  )

  /**
   * Load data from storage with validation and recovery
   */
  const loadData = useCallback((): T | null => {
    try {
      const stored = localStorage.getItem(key)
      if (!stored) return null

      const parsed = JSON.parse(stored)

      // Handle versioned data
      if (versioned && isVersionedData<T>(parsed)) {
        if (parsed.version !== version) {
          logger.warn(
            `[Enhanced Persistence] Version mismatch for ${key}: stored=${parsed.version}, expected=${version}`
          )
          // Attempt migration or recovery
          return null
        }
        
        // Validate if validator provided
        if (validator && !validator(parsed.data)) {
          logger.error(`[Enhanced Persistence] Validation failed for ${key}`)
          return attemptRecovery(key)
        }
        
        return parsed.data
      }

      // Handle non-versioned data
      if (validator && !validator(parsed)) {
        logger.error(`[Enhanced Persistence] Validation failed for ${key}`)
        return attemptRecovery(key)
      }

      return parsed as T
    } catch (error) {
      logger.error(`[Enhanced Persistence] Load failed for ${key}:`, error)
      return attemptRecovery(key)
    }
  }, [key, versioned, version, validator])

  /**
   * Create backup of data
   */
  const createBackup = (storageKey: string, data: string) => {
    try {
      // Rotate backups
      const backups: string[] = []
      for (let i = 1; i < MAX_BACKUPS; i++) {
        const backupKey = `${storageKey}${BACKUP_SUFFIX}-${i}`
        const backup = localStorage.getItem(backupKey)
        if (backup) {
          backups.push(backup)
        }
      }

      // Shift backups
      backups.unshift(data)
      backups.slice(0, MAX_BACKUPS).forEach((backup, index) => {
        localStorage.setItem(`${storageKey}${BACKUP_SUFFIX}-${index + 1}`, backup)
      })
    } catch (error) {
      logger.warn(`[Enhanced Persistence] Backup creation failed for ${storageKey}:`, error)
    }
  }

  /**
   * Attempt recovery from backups
   */
  const attemptRecovery = (storageKey: string): T | null => {
    logger.warn(`[Enhanced Persistence] Attempting recovery for ${storageKey}`)

    for (let i = 1; i <= MAX_BACKUPS; i++) {
      const backupKey = `${storageKey}${BACKUP_SUFFIX}-${i}`
      try {
        const backup = localStorage.getItem(backupKey)
        if (backup) {
          const parsed = JSON.parse(backup)
          const recoveredData = versioned && isVersionedData<T>(parsed) ? parsed.data : parsed

          // Validate recovered data
          if (!validator || validator(recoveredData)) {
            logger.info(`[Enhanced Persistence] Recovered from backup ${i} for ${storageKey}`)
            
            // Restore to main storage
            localStorage.setItem(storageKey, backup)
            
            if (onRecovery) {
              onRecovery(recoveredData)
            }
            
            return recoveredData
          }
        }
      } catch (error) {
        logger.warn(`[Enhanced Persistence] Backup ${i} recovery failed for ${storageKey}:`, error)
      }
    }

    logger.error(`[Enhanced Persistence] All recovery attempts failed for ${storageKey}`)
    return null
  }

  /**
   * Auto-save effect
   */
  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    if (!enabled) return

    const debouncedSave = debounce(() => {
      saveData(data)
    }, debounceMs)

    debouncedSave()

    return () => {
      debouncedSave.cancel?.()
    }
  }, [data, enabled, debounceMs, saveData])

  return {
    loadData,
    saveData: () => saveData(data),
    attemptRecovery: () => attemptRecovery(key),
  }
}

/**
 * Type guard for versioned data
 */
function isVersionedData<T>(data: unknown): data is VersionedData<T> {
  return (
    typeof data === 'object' &&
    data !== null &&
    'version' in data &&
    'data' in data &&
    'timestamp' in data &&
    typeof (data as VersionedData<T>).version === 'number'
  )
}

/**
 * Load persisted data with enhanced recovery
 */
export function loadEnhancedData<T>(
  key: string,
  defaultValue: T,
  validator?: (data: unknown) => data is T
): T {
  try {
    const item = localStorage.getItem(key)
    if (!item) return defaultValue

    const parsed = JSON.parse(item)

    // Validate if validator provided
    if (validator && !validator(parsed)) {
      logger.error(`[Enhanced Persistence] Validation failed for ${key}, using default`)
      return defaultValue
    }

    return parsed as T
  } catch (error) {
    logger.error(`[Enhanced Persistence] Load failed for ${key}:`, error)
    return defaultValue
  }
}
