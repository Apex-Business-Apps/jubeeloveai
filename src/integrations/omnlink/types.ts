export type OmniLinkStatus = 'disabled' | 'enabled' | 'misconfigured';

export interface OmniLinkConfig {
  enabled: boolean;
  baseUrl?: string;
  tenantId?: string;
  status: OmniLinkStatus;
}

export interface OmniLinkEvent {
  type: string;
  payload: Record<string, unknown>;
  timestamp?: string;
  meta?: Record<string, unknown>;
}

