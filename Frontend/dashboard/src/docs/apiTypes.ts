/**
 * ProxyShield-11 API Types
 * Auto-generated from backend models and schemas
 */

// ============================================================================
// Common Types
// ============================================================================

export interface ApiResponse<T> {
  statusCode: number;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

// ============================================================================
// User Types
// ============================================================================

export type DeviceType = 'desktop' | 'mobile' | 'tablet' | 'other';
export type UserStatus = 'active' | 'suspended' | 'deleted';

export interface Device {
  device_id: string;
  device_name?: string;
  device_type: DeviceType;
  last_active: string;
  push_token?: string;
}

export interface User {
  _id: string;
  firebase_uid: string;
  real_email: string;
  real_phone?: string;
  devices: Device[];
  created_at: string;
  updated_at: string;
  last_login?: string;
  status: UserStatus;
}

export interface CreateUserRequest {
  firebase_uid: string;
  real_email: string;
  real_phone?: string;
  devices?: Device[];
  status?: UserStatus;
}

export interface UpdateUserRequest {
  real_email?: string;
  real_phone?: string;
  devices?: Device[];
  status?: UserStatus;
}

// ============================================================================
// Shield Identity Types
// ============================================================================

export type ShieldStatus = 'active' | 'burned' | 'compromised';

export interface ShieldIdentity {
  _id: string;
  user_id: string | User;
  proxy_email: string;
  proxy_phone?: string;
  browser_fingerprint?: string;
  creation_time: string;
  last_used?: string;
  status: ShieldStatus;
  linked_services: string[];
}

export interface CreateShieldIdentityRequest {
  user_id: string;
  proxy_email: string;
  proxy_phone?: string;
  browser_fingerprint?: string;
  linked_services?: string[];
  status?: ShieldStatus;
}

export interface UpdateShieldIdentityRequest {
  proxy_email?: string;
  proxy_phone?: string;
  browser_fingerprint?: string;
  linked_services?: string[];
  status?: ShieldStatus;
  burn_reason?: string;
}

// ============================================================================
// Threat Event Types
// ============================================================================

export type ThreatEventType = 'credential_leak' | 'unauthorized_ip' | 'phishing_attempt';
export type ThreatSeverity = 'low' | 'medium' | 'high';

export interface ThreatEvent {
  _id: string;
  shield_id: string | ShieldIdentity;
  event_type: ThreatEventType;
  detected_at: string;
  severity: ThreatSeverity;
  metadata?: Record<string, unknown>;
}

export interface CreateThreatEventRequest {
  shield_id: string;
  event_type: ThreatEventType;
  severity?: ThreatSeverity;
  metadata?: Record<string, unknown>;
}

export interface UpdateThreatEventRequest {
  event_type?: ThreatEventType;
  severity?: ThreatSeverity;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// Identity Rotation Types
// ============================================================================

export type RotationType = 'auto' | 'manual';

export interface IdentityRotation {
  _id: string;
  shield_id: string | ShieldIdentity;
  rotation_type: RotationType;
  timestamp: string;
  reason?: string;
  new_shield_id?: string | ShieldIdentity;
}

export interface CreateIdentityRotationRequest {
  shield_id: string;
  rotation_type: RotationType;
  reason?: string;
  new_shield_id?: string;
}

export interface UpdateIdentityRotationRequest {
  rotation_type?: RotationType;
  reason?: string;
  new_shield_id?: string;
}

// ============================================================================
// Audit Log Types
// ============================================================================

export type AuditAction = 'rotation' | 'burn' | 'login_attempt' | 'communication_filtered';

export interface AuditLog {
  _id: string;
  shield_id: string | ShieldIdentity;
  action: AuditAction;
  timestamp: string;
  blockchain_hash: string;
  metadata?: Record<string, unknown>;
}

export interface CreateAuditLogRequest {
  shield_id: string;
  action: AuditAction;
  metadata?: Record<string, unknown>;
  blockchain_hash?: string;
}

export interface UpdateAuditLogRequest {
  action?: AuditAction;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// AI Engine Log Types
// ============================================================================

export type AIAction = 'allow' | 'challenge' | 'block' | 'burn_and_rotate';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface AIEngineLog {
  _id: string;
  shield_id?: string | ShieldIdentity;
  action?: string;
  confidence?: number;
  timestamp: string;
  metadata?: AILogMetadata;
}

export interface AILogMetadata {
  risk_level?: RiskLevel;
  risk_score?: number;
  flags?: string[];
  mfa_method?: string;
  latency_ms?: number;
  [key: string]: unknown;
}

export interface CreateAILogRequest {
  shield_id: string;
  action?: AIAction;
  confidence?: number;
  metadata?: AILogMetadata;
}

export interface UpdateAILogRequest {
  action?: string;
  confidence?: number;
  metadata?: AILogMetadata;
}

// ============================================================================
// Shield Access Types
// ============================================================================

export type ShieldDeviceType = 'mobile' | 'desktop' | 'tablet' | 'other';

export interface ShieldAccess {
  _id: string;
  shield_id: string;
  timestamp: string;
  ip_address: string;
  ip_country: string;
  device_type: ShieldDeviceType;
  browser: string;
  os: string;
  login_hour: number;
  request_frequency: number;
  is_proxy: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShieldAccessRequest {
  shield_id: string;
  timestamp: string;
  ip_address: string;
  ip_country: string;
  device_type: ShieldDeviceType;
  browser: string;
  os: string;
  login_hour: number;
  request_frequency?: number;
  is_proxy?: boolean;
}

export interface UpdateShieldAccessRequest {
  ip_address?: string;
  ip_country?: string;
  device_type?: ShieldDeviceType;
  browser?: string;
  os?: string;
  login_hour?: number;
  request_frequency?: number;
  is_proxy?: boolean;
}

// ============================================================================
// Communication Proxy Types
// ============================================================================

export type CommunicationType = 'email' | 'sms';
export type CommunicationStatus = 'pending' | 'delivered' | 'filtered' | 'blocked';

export interface CommunicationProxy {
  _id: string;
  shield_id: string | ShieldIdentity;
  type: CommunicationType;
  sender?: string;
  recipient?: string;
  received_at: string;
  delivered_at?: string;
  status: CommunicationStatus;
  sanitized_content?: string;
}

export interface CreateCommunicationProxyRequest {
  shield_id: string;
  type: CommunicationType;
  sender?: string;
  recipient?: string;
  status?: CommunicationStatus;
  sanitized_content?: string;
}

export interface UpdateCommunicationProxyRequest {
  type?: CommunicationType;
  sender?: string;
  recipient?: string;
  status?: CommunicationStatus;
  delivered_at?: string;
  sanitized_content?: string;
}

// ============================================================================
// Proxy Engine - Email Types
// ============================================================================

export interface EmailAttachment {
  filename: string;
  contentType: string;
}

export interface Email {
  _id: string;
  messageId?: string;
  from: string;
  to: string;
  proxyEmail?: string;
  realEmail?: string;
  userId?: string;
  shieldIdentityId?: string;
  subject: string;
  text: string;
  html: string;
  headers?: Record<string, string>;
  attachments?: EmailAttachment[];
  receivedAt: string;
  delivered?: boolean;
  deliveryError?: string;
  isFraudulent?: boolean;
  fraudFlags?: string[];
}

export interface ReceiveEmailRequest {
  from: string;
  to: string;
  subject?: string;
  text?: string;
  html?: string;
  messageId?: string;
  headers?: Record<string, string>;
  attachments?: EmailAttachment[];
  skipRouting?: boolean;
}

export interface EmailListParams {
  page?: number;
  limit?: number;
  fraudulent?: boolean;
}

// ============================================================================
// Proxy Engine - Fraud Report Types
// ============================================================================

export type FraudReportType = 'phishing' | 'spam' | 'malware' | 'spoofing' | 'other';
export type FraudReportStatus = 'pending' | 'investigating' | 'resolved' | 'false_positive';
export type FraudSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface FraudReport {
  _id: string;
  emailId: string | Email;
  reportType: FraudReportType;
  description: string;
  reportedBy: string;
  status: FraudReportStatus;
  severity: FraudSeverity;
  indicators: string[];
  resolution?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFraudReportRequest {
  emailId: string;
  reportType: FraudReportType;
  description?: string;
  reportedBy: string;
  severity?: FraudSeverity;
  indicators?: string[];
}

export interface FraudReportListParams {
  page?: number;
  limit?: number;
  status?: FraudReportStatus;
  reportType?: FraudReportType;
}

// ============================================================================
// AI Engine Types
// ============================================================================

export type AIDeviceType = 'mobile' | 'desktop' | 'tablet' | 'unknown';
export type AIRiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type AIRecommendedAction = 'allow' | 'challenge' | 'block';

export interface AIHealthResponse {
  status: string;
  service: string;
  version: string;
}

export interface AIScoreRequest {
  shield_id: string;
  timestamp: string;
  ip_address: string;
  ip_country: string;
  device_type: AIDeviceType;
  browser: string;
  os: string;
  login_hour: number;
  request_frequency: number;
  is_proxy: boolean;
}

export interface AIScoreResponse {
  shield_id: string;
  risk_score: number;
  risk_level: AIRiskLevel;
  action: AIRecommendedAction;
  flags: string[];
  latency_ms: number;
}

// ============================================================================
// Blockchain Event Types
// ============================================================================

export type BlockchainEventType =
  | 'identity_created'
  | 'identity_rotated'
  | 'identity_burned'
  | 'anomaly_detected'
  | 'mfa_triggered'
  | 'threat_event';

export interface BlockchainEvent {
  event_id: string;
  event_type: BlockchainEventType;
  shield_id: string;
  risk_level?: RiskLevel;
  metadata: Record<string, unknown>;
  timestamp: string;
  system: 'proxyshield-11';
}
