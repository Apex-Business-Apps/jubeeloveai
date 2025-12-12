import type { OmniLinkConfig } from './types';

function normalizeBooleanFlag(value: string | undefined): boolean {
  return value?.toLowerCase() === 'true';
}

export function getOmniLinkConfig(): OmniLinkConfig {
  const enabled = normalizeBooleanFlag(import.meta.env.VITE_OMNILINK_ENABLED ?? import.meta.env.OMNILINK_ENABLED);
  const baseUrl = import.meta.env.VITE_OMNILINK_BASE_URL ?? import.meta.env.OMNILINK_BASE_URL;
  const tenantId = import.meta.env.VITE_OMNILINK_TENANT_ID ?? import.meta.env.OMNILINK_TENANT_ID;

  if (!enabled) {
    return {
      enabled: false,
      status: 'disabled',
    };
  }

  const isConfigured = Boolean(baseUrl && tenantId);
  return {
    enabled: true,
    baseUrl,
    tenantId,
    status: isConfigured ? 'enabled' : 'misconfigured',
  };
}

