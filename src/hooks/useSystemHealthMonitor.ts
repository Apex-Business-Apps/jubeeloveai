/**
 * System Health Monitor Hook
 * 
 * Continuous monitoring of all critical systems with automatic recovery.
 * Integrates all regression guards and failsafes into a unified health monitoring system.
 */

import { useEffect, useRef, useState } from 'react'
import { runSystemHealthCheck, autoFixSystemIssues, type SystemHealthReport } from '@/lib/systemHealthCheck'
import { logger } from '@/lib/logger'

interface HealthMonitorConfig {
  enabled: boolean
  checkIntervalMs: number
  autoFixEnabled: boolean
  logResults: boolean
}

const DEFAULT_CONFIG: HealthMonitorConfig = {
  enabled: true,
  checkIntervalMs: 30000, // 30 seconds
  autoFixEnabled: true,
  logResults: false, // Only log in dev
}

export function useSystemHealthMonitor(config: Partial<HealthMonitorConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  const [healthReport, setHealthReport] = useState<SystemHealthReport | null>(null)
  const [isHealthy, setIsHealthy] = useState(true)
  const lastCheckRef = useRef<number>(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!finalConfig.enabled) {
      logger.dev('[System Health Monitor] Disabled')
      return
    }

    logger.dev('[System Health Monitor] Starting continuous monitoring...')

    async function performHealthCheck() {
      const now = Date.now()
      
      // Throttle checks to prevent excessive monitoring
      if (now - lastCheckRef.current < 10000) {
        return
      }
      
      lastCheckRef.current = now

      try {
        // Run comprehensive health check
        const report = await runSystemHealthCheck()
        
        setHealthReport(report)
        setIsHealthy(report.overallHealth !== 'critical')

        // Auto-fix if enabled and issues detected
        if (finalConfig.autoFixEnabled && report.criticalFailures > 0) {
          logger.warn('[System Health Monitor] Critical failures detected - attempting auto-fix')
          const fixed = await autoFixSystemIssues()
          
          if (fixed) {
            logger.info('[System Health Monitor] Auto-fix applied successfully')
            // Re-run health check after fix
            const updatedReport = await runSystemHealthCheck()
            setHealthReport(updatedReport)
            setIsHealthy(updatedReport.overallHealth !== 'critical')
          }
        }

        // Log results in dev mode or if explicitly enabled
        if (finalConfig.logResults || import.meta.env.DEV) {
          if (report.overallHealth !== 'healthy') {
            logger.group('[System Health Monitor] Health Check Results')
            logger.info(`Overall Health: ${report.overallHealth}`)
            logger.info(`Critical Failures: ${report.criticalFailures}`)
            logger.info(`Warnings: ${report.warnings}`)
            
            report.results
              .filter(r => !r.passed)
              .forEach(result => {
                const level = result.severity === 'critical' ? 'error' : 'warn'
                logger[level](`[${result.system}] ${result.message}`)
              })
            
            logger.groupEnd()
          }
        }
      } catch (error) {
        logger.error('[System Health Monitor] Health check failed:', error)
        setIsHealthy(false)
      }
    }

    // Initial check
    performHealthCheck()

    // Set up periodic checks
    intervalRef.current = setInterval(performHealthCheck, finalConfig.checkIntervalMs)

    // Check on visibility change (user returns to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        performHealthCheck()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      logger.dev('[System Health Monitor] Stopped')
    }
  }, [finalConfig.enabled, finalConfig.checkIntervalMs, finalConfig.autoFixEnabled, finalConfig.logResults])

  return {
    healthReport,
    isHealthy,
    lastCheck: lastCheckRef.current,
  }
}
