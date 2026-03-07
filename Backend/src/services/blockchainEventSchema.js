/**
 * Blockchain Event Schema for ProxyShield-11
 * 
 * Defines the canonical event structure for all security events
 * before they are submitted to the Hyperledger Fabric ledger.
 * 
 * Source models:
 *   - ShieldIdentity  (identity creation, burn, status)
 *   - ThreatEvent     (credential_leak, unauthorized_ip, phishing_attempt)
 *   - AiCustoomLog    (AI risk scoring results)
 *   - IdentityRotation (rotation records)
 *   - AuditLog        (blockchain_hash persistence)
 */

import crypto from 'crypto';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SYSTEM_ID = 'proxyshield-11';

/**
 * Supported blockchain event types
 */
export const EVENT_TYPES = Object.freeze({
  IDENTITY_CREATED:  'identity_created',
  IDENTITY_ROTATED:  'identity_rotated',
  IDENTITY_BURNED:   'identity_burned',
  ANOMALY_DETECTED:  'anomaly_detected',
  MFA_TRIGGERED:     'mfa_triggered',
  THREAT_EVENT:      'threat_event',
});

// ---------------------------------------------------------------------------
// UUID Generator
// ---------------------------------------------------------------------------

function generateEventId() {
  return crypto.randomUUID();
}

// ---------------------------------------------------------------------------
// Base Builder
// ---------------------------------------------------------------------------

/**
 * Build the canonical blockchain event envelope.
 * Every event on-chain follows this exact structure.
 *
 * @param {string} eventType  - One of EVENT_TYPES values
 * @param {string} shieldId   - ShieldIdentity._id as string
 * @param {string} riskLevel  - "low" | "medium" | "high" | "critical" | "none"
 * @param {Object} metadata   - Event-specific payload
 * @returns {{ event_id: string, event_type: string, shield_id: string, risk_level: string, metadata: Object, timestamp: string, system: string }}
 */
function buildBlockchainEvent(eventType, shieldId, riskLevel, metadata) {
  return {
    event_id:   generateEventId(),
    event_type: eventType,
    shield_id:  String(shieldId),
    risk_level: riskLevel || 'none',
    metadata:   metadata || {},
    timestamp:  new Date().toISOString(),
    system:     SYSTEM_ID,
  };
}

// ---------------------------------------------------------------------------
// Event Builders  (one per event type)
// ---------------------------------------------------------------------------

/**
 * identity_created
 * 
 * Called after ShieldIdentity is saved.
 * 
 * @param {Object} shieldIdentity - ShieldIdentity mongoose document
 * @returns {Object} Blockchain event
 */
export function buildIdentityCreatedEvent(shieldIdentity) {
  return buildBlockchainEvent(
    EVENT_TYPES.IDENTITY_CREATED,
    shieldIdentity._id,
    'none',
    {
      user_id:         String(shieldIdentity.user_id),
      proxy_email:     shieldIdentity.proxy_email,
      proxy_phone:     shieldIdentity.proxy_phone || null,
      status:          shieldIdentity.status,
      linked_services: shieldIdentity.linked_services,
      creation_time:   shieldIdentity.creation_time?.toISOString() || new Date().toISOString(),
    },
  );
}

/**
 * identity_rotated
 * 
 * Called after IdentityRotation is saved.
 * 
 * @param {Object} rotation       - IdentityRotation mongoose document
 * @param {Object} oldShield      - Previous ShieldIdentity document
 * @returns {Object} Blockchain event
 */
export function buildIdentityRotatedEvent(rotation, oldShield) {
  return buildBlockchainEvent(
    EVENT_TYPES.IDENTITY_ROTATED,
    rotation.shield_id,
    'medium',
    {
      rotation_type:   rotation.rotation_type,   // "auto" | "manual"
      reason:          rotation.reason || null,
      old_shield_id:   String(rotation.shield_id),
      new_shield_id:   rotation.new_shield_id ? String(rotation.new_shield_id) : null,
      old_proxy_email: oldShield?.proxy_email || null,
      old_status:      oldShield?.status || null,
      rotation_time:   rotation.timestamp?.toISOString() || new Date().toISOString(),
    },
  );
}

/**
 * identity_burned
 * 
 * Called when ShieldIdentity.status is updated to "burned".
 * 
 * @param {Object} shieldIdentity - ShieldIdentity document (post-burn)
 * @param {string} reason         - Burn reason
 * @param {number|null} riskScore - Risk score that triggered the burn (0-1)
 * @returns {Object} Blockchain event
 */
export function buildIdentityBurnedEvent(shieldIdentity, reason, riskScore) {
  const level = riskScore >= 0.91 ? 'critical'
              : riskScore >= 0.71 ? 'high'
              : 'medium';

  return buildBlockchainEvent(
    EVENT_TYPES.IDENTITY_BURNED,
    shieldIdentity._id,
    level,
    {
      user_id:       String(shieldIdentity.user_id),
      proxy_email:   shieldIdentity.proxy_email,
      burn_reason:   reason || 'risk_threshold_exceeded',
      risk_score:    riskScore ?? null,
      burned_at:     new Date().toISOString(),
      previous_status: 'active', // always active before a burn
    },
  );
}

/**
 * anomaly_detected
 * 
 * Called when the AI Engine returns risk_level >= "medium".
 * Maps from AiCustoomLog / AI Engine response.
 * 
 * @param {Object} aiResult - AI Engine risk response
 *   { shield_id, risk_score, risk_level, action, flags, latency_ms }
 * @returns {Object} Blockchain event
 */
export function buildAnomalyDetectedEvent(aiResult) {
  return buildBlockchainEvent(
    EVENT_TYPES.ANOMALY_DETECTED,
    aiResult.shield_id,
    aiResult.risk_level,
    {
      risk_score:  aiResult.risk_score,
      action:      aiResult.action,        // "allow" | "challenge" | "block"
      flags:       aiResult.flags || [],   // ["proxy_detected", "high_frequency", ...]
      confidence:  aiResult.confidence ?? aiResult.risk_score,
      latency_ms:  aiResult.latency_ms ?? null,
      detected_at: new Date().toISOString(),
    },
  );
}

/**
 * mfa_triggered
 * 
 * Called when AI Engine action is "challenge" and MFA is initiated.
 * 
 * @param {string} shieldId  - ShieldIdentity ID
 * @param {Object} aiResult  - AI Engine risk response
 * @param {string} mfaMethod - MFA method used ("sms" | "email" | "totp" | "push")
 * @returns {Object} Blockchain event
 */
export function buildMfaTriggeredEvent(shieldId, aiResult, mfaMethod) {
  return buildBlockchainEvent(
    EVENT_TYPES.MFA_TRIGGERED,
    shieldId,
    aiResult.risk_level || 'medium',
    {
      risk_score:    aiResult.risk_score,
      action:        aiResult.action,
      flags:         aiResult.flags || [],
      mfa_method:    mfaMethod || 'unknown',
      triggered_at:  new Date().toISOString(),
    },
  );
}

/**
 * threat_event
 * 
 * Called after ThreatEvent is saved.
 * Maps from ThreatEvent mongoose document.
 * 
 * @param {Object} threatEvent - ThreatEvent mongoose document
 * @returns {Object} Blockchain event
 */
export function buildThreatEventEvent(threatEvent) {
  // Map ThreatEvent.severity → blockchain risk_level
  const severityToRisk = {
    low:    'low',
    medium: 'medium',
    high:   'high',
  };

  return buildBlockchainEvent(
    EVENT_TYPES.THREAT_EVENT,
    threatEvent.shield_id,
    severityToRisk[threatEvent.severity] || 'medium',
    {
      event_type:  threatEvent.event_type,  // "credential_leak" | "unauthorized_ip" | "phishing_attempt"
      severity:    threatEvent.severity,
      detected_at: threatEvent.detected_at?.toISOString() || new Date().toISOString(),
      threat_metadata: threatEvent.metadata || {},
    },
  );
}

// ---------------------------------------------------------------------------
// Default export
// ---------------------------------------------------------------------------

export default {
  EVENT_TYPES,
  buildIdentityCreatedEvent,
  buildIdentityRotatedEvent,
  buildIdentityBurnedEvent,
  buildAnomalyDetectedEvent,
  buildMfaTriggeredEvent,
  buildThreatEventEvent,
};
