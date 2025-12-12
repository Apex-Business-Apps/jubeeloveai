import { logger } from '@/lib/logger';
import type { OmniLinkConfig, OmniLinkEvent } from './types';
import { getOmniLinkConfig } from './config';

const REQUEST_TIMEOUT_MS = 5000;

export class OmniLinkAdapter {
  private readonly config: OmniLinkConfig;

  constructor(config: OmniLinkConfig = getOmniLinkConfig()) {
    this.config = config;
  }

  isEnabled(): boolean {
    return this.config.enabled && this.config.status === 'enabled';
  }

  getStatus(): OmniLinkConfig['status'] {
    return this.config.status;
  }

  async sendEvent(event: OmniLinkEvent): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    if (this.config.status === 'misconfigured') {
      logger.warn('[OmniLink] Enabled but misconfigured; event dropped', { eventType: event.type });
      return;
    }

    if (!this.config.baseUrl || !this.config.tenantId) {
      logger.warn('[OmniLink] Missing baseUrl or tenantId; event dropped', { eventType: event.type });
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const url = `${this.config.baseUrl.replace(/\/$/, '')}/tenants/${encodeURIComponent(this.config.tenantId)}/events`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          timestamp: event.timestamp ?? new Date().toISOString(),
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        logger.warn('[OmniLink] Event dispatch failed', {
          status: response.status,
          statusText: response.statusText,
        });
      }
    } catch (error) {
      logger.warn('[OmniLink] Event dispatch error', { error });
    } finally {
      clearTimeout(timeout);
    }
  }
}

export function createOmniLinkClient(): OmniLinkAdapter {
  return new OmniLinkAdapter();
}

