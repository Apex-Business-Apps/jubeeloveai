/**
 * Unified Jubee Hook - Single source of truth for all Jubee interactions
 * Consolidates conversation, performance, dragging, collision, and health monitoring
 */

import { useRef, useEffect, useCallback, useState } from 'react'
import { useJubeeStore } from '@/store/useJubeeStore'
import { validatePosition } from '@/core/jubee/JubeePositionValidator'
import { performHealthCheck, executeRecovery } from '@/core/jubee/JubeeErrorRecovery'

interface DragState {
  startX: number
  startY: number
  initialBottom: number
  initialRight: number
}

interface UseJubeeOptions {
  enableDragging?: boolean
  enableCollisionDetection?: boolean
  enableHealthMonitoring?: boolean
}

export function useJubee(
  containerRef: React.RefObject<HTMLDivElement>,
  options: UseJubeeOptions = {}
) {
  const {
    enableDragging = true,
    enableCollisionDetection = true,
    enableHealthMonitoring = true,
  } = options

  const [isDragging, setIsDragging] = useState(false)
  const [healthStatus, setHealthStatus] = useState<'healthy' | 'degraded' | 'critical'>('healthy')
  const dragStateRef = useRef<DragState | null>(null)

  const store = useJubeeStore()
  const { converse, isProcessing, lastError, setContainerPosition, containerPosition } = store

  // === CONVERSATION ===
  const askJubee = useCallback(async (
    message: string,
    options?: {
      activity?: string
      mood?: 'happy' | 'excited' | 'frustrated' | 'curious' | 'tired'
      childName?: string
    }
  ) => {
    if (!message.trim()) {
      console.warn('[Jubee] Empty message')
      return null
    }

    try {
      return await converse(message, options)
    } catch (error) {
      console.error('[Jubee] Conversation failed:', error)
      return null
    }
  }, [converse])

  // === DRAGGING ===
  const validateBoundaries = useCallback((bottom: number, right: number) => {
    const validated = validatePosition(undefined, { bottom, right })
    return validated.container
  }, [])

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!enableDragging || !containerRef.current) return
    
    e.preventDefault()
    setIsDragging(true)
    
    dragStateRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialBottom: containerPosition.bottom,
      initialRight: containerPosition.right,
    }
  }, [enableDragging, containerPosition, containerRef])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragStateRef.current) return

    const deltaX = dragStateRef.current.startX - e.clientX
    const deltaY = e.clientY - dragStateRef.current.startY

    const newRight = dragStateRef.current.initialRight + deltaX
    const newBottom = dragStateRef.current.initialBottom + deltaY

    const validated = validateBoundaries(newBottom, newRight)
    
    if (containerRef.current) {
      containerRef.current.style.bottom = `${validated.bottom}px`
      containerRef.current.style.right = `${validated.right}px`
    }
  }, [isDragging, validateBoundaries, containerRef])

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return

    setIsDragging(false)
    dragStateRef.current = null

    if (containerRef.current) {
      const bottom = parseInt(containerRef.current.style.bottom || '0')
      const right = parseInt(containerRef.current.style.right || '0')
      const validated = validateBoundaries(bottom, right)
      setContainerPosition(validated)
    }
  }, [isDragging, validateBoundaries, setContainerPosition, containerRef])

  // === COLLISION DETECTION ===
  const detectAndResolveCollisions = useCallback(() => {
    if (!enableCollisionDetection || !containerRef.current) return

    const jubeeRect = containerRef.current.getBoundingClientRect()
    const interactiveSelectors = 'button, a, input, select, textarea, [role="button"], .nav-button'
    const interactiveElements = document.querySelectorAll(interactiveSelectors)

    const collisions = Array.from(interactiveElements).filter(el => {
      if (el === containerRef.current || containerRef.current?.contains(el as Node)) return false
      const elRect = el.getBoundingClientRect()
      return !(
        jubeeRect.right < elRect.left ||
        jubeeRect.left > elRect.right ||
        jubeeRect.bottom < elRect.top ||
        jubeeRect.top > elRect.bottom
      )
    })

    if (collisions.length > 0) {
      console.log('[Jubee] Collision detected, auto-repositioning')
      const validated = validateBoundaries(containerPosition.bottom + 100, containerPosition.right)
      setContainerPosition(validated)
    }
  }, [enableCollisionDetection, containerPosition, validateBoundaries, setContainerPosition, containerRef])

  // === HEALTH MONITORING ===
  const checkHealth = useCallback(() => {
    if (!enableHealthMonitoring) return

    const health = performHealthCheck(store)
    
    if (!health.isHealthy) {
      console.warn('[Jubee Health] Issues detected:', health.issues)
      
      if (health.recommendedAction !== 'none') {
        executeRecovery(health.recommendedAction, (updates) => {
          Object.entries(updates).forEach(([key, value]) => {
            const setter = (store as any)[`set${key.charAt(0).toUpperCase()}${key.slice(1)}`]
            if (setter) setter(value)
          })
        })
      }

      setHealthStatus(health.issues.length > 2 ? 'critical' : 'degraded')
    } else {
      setHealthStatus('healthy')
    }
  }, [enableHealthMonitoring, store])

  // === EVENT LISTENERS ===
  useEffect(() => {
    if (!enableDragging || !containerRef.current) return

    const container = containerRef.current
    container.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      container.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [enableDragging, handleMouseDown, handleMouseMove, handleMouseUp, containerRef])

  // === COLLISION MONITORING ===
  useEffect(() => {
    if (!enableCollisionDetection) return

    const observer = new MutationObserver(detectAndResolveCollisions)
    observer.observe(document.body, { childList: true, subtree: true })

    window.addEventListener('resize', detectAndResolveCollisions)
    const collisionInterval = setInterval(detectAndResolveCollisions, 2000)

    detectAndResolveCollisions() // Initial check

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', detectAndResolveCollisions)
      clearInterval(collisionInterval)
    }
  }, [enableCollisionDetection, detectAndResolveCollisions])

  // === HEALTH MONITORING ===
  useEffect(() => {
    if (!enableHealthMonitoring) return

    const healthInterval = setInterval(checkHealth, 5000)
    checkHealth() // Initial check

    return () => clearInterval(healthInterval)
  }, [enableHealthMonitoring, checkHealth])

  return {
    // Conversation
    askJubee,
    isProcessing,
    lastError,
    
    // State
    isDragging,
    healthStatus,
    
    // Manual controls
    checkHealth,
    detectCollisions: detectAndResolveCollisions,
  }
}
