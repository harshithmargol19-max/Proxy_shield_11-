/**
 * Hyperledger Fabric Blockchain Service for ProxyShield-11
 * 
 * Handles connection to Fabric network and submits security events
 * to the immutable ledger for audit trail purposes.
 */

import { connect, signers } from '@hyperledger/fabric-gateway';
import * as grpc from '@grpc/grpc-js';
import * as crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const CHANNEL_NAME = 'proxyshield-channel';
const CHAINCODE_NAME = 'securitylogs';

// Paths - adjust based on your Fabric network setup
const CONFIG_PATH = process.env.FABRIC_CONFIG_PATH || path.resolve(__dirname, '../../../fabric-config');
const CONNECTION_PROFILE_PATH = process.env.FABRIC_CONNECTION_PROFILE || path.join(CONFIG_PATH, 'connection-org1.json');
const WALLET_PATH = process.env.FABRIC_WALLET_PATH || path.join(CONFIG_PATH, 'wallet');
const MSP_ID = process.env.FABRIC_MSP_ID || 'Org1MSP';
const IDENTITY_LABEL = process.env.FABRIC_IDENTITY || 'appUser';

// Peer endpoint
const PEER_ENDPOINT = process.env.FABRIC_PEER_ENDPOINT || 'localhost:7051';
const PEER_HOST_ALIAS = process.env.FABRIC_PEER_HOST_ALIAS || 'peer0.org1.example.com';

// ---------------------------------------------------------------------------
// Connection State (Singleton Pattern)
// ---------------------------------------------------------------------------

let gateway = null;
let client = null;
let contract = null;

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * Load credentials from wallet directory
 */
async function loadCredentials() {
  const certPath = path.join(WALLET_PATH, IDENTITY_LABEL, 'cert.pem');
  const keyPath = path.join(WALLET_PATH, IDENTITY_LABEL, 'key.pem');
  
  const certificate = await fs.readFile(certPath, 'utf8');
  const privateKeyPem = await fs.readFile(keyPath, 'utf8');
  const privateKey = crypto.createPrivateKey(privateKeyPem);
  
  return { certificate, privateKey };
}

/**
 * Load TLS certificate for peer connection
 */
async function loadTlsCertificate() {
  const tlsCertPath = process.env.FABRIC_TLS_CERT_PATH || 
    path.join(CONFIG_PATH, 'tls', 'ca.crt');
  
  return await fs.readFile(tlsCertPath);
}

/**
 * Create gRPC client connection to peer
 */
async function createGrpcConnection() {
  const tlsRootCert = await loadTlsCertificate();
  const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
  
  return new grpc.Client(PEER_ENDPOINT, tlsCredentials, {
    'grpc.ssl_target_name_override': PEER_HOST_ALIAS,
  });
}

/**
 * Generate unique transaction ID
 */
function generateTxId() {
  const timestamp = Date.now().toString(36);
  const randomPart = crypto.randomBytes(8).toString('hex');
  return `tx_${timestamp}_${randomPart}`;
}

// ---------------------------------------------------------------------------
// Connection Management
// ---------------------------------------------------------------------------

/**
 * Initialize connection to Hyperledger Fabric network
 * Uses singleton pattern to reuse connection
 */
async function initializeGateway() {
  if (gateway && contract) {
    return contract;
  }

  try {
    // Load identity credentials
    const { certificate, privateKey } = await loadCredentials();
    
    // Create signer from private key
    const signer = signers.newPrivateKeySigner(privateKey);
    
    // Create gRPC connection
    client = await createGrpcConnection();
    
    // Connect to gateway
    gateway = connect({
      client,
      identity: {
        mspId: MSP_ID,
        credentials: Buffer.from(certificate),
      },
      signer,
      // Evaluation timeout for query operations
      evaluateOptions: () => ({ deadline: Date.now() + 5000 }),
      // Endorsement timeout
      endorseOptions: () => ({ deadline: Date.now() + 15000 }),
      // Submit timeout
      submitOptions: () => ({ deadline: Date.now() + 5000 }),
      // Commit status timeout
      commitStatusOptions: () => ({ deadline: Date.now() + 60000 }),
    });
    
    // Get network channel
    const network = gateway.getNetwork(CHANNEL_NAME);
    
    // Get chaincode contract
    contract = network.getContract(CHAINCODE_NAME);
    
    console.log('[BlockchainService] Connected to Fabric network');
    console.log(`[BlockchainService] Channel: ${CHANNEL_NAME}, Chaincode: ${CHAINCODE_NAME}`);
    
    return contract;
    
  } catch (error) {
    console.error('[BlockchainService] Failed to initialize gateway:', error.message);
    throw error;
  }
}

/**
 * Close gateway connection (for graceful shutdown)
 */
async function closeGateway() {
  if (gateway) {
    gateway.close();
    gateway = null;
    contract = null;
  }
  if (client) {
    client.close();
    client = null;
  }
  console.log('[BlockchainService] Gateway connection closed');
}

// ---------------------------------------------------------------------------
// Main Service Functions
// ---------------------------------------------------------------------------

/**
 * Log a security event to the blockchain
 * 
 * @param {string} eventType - Type of event: 'identity_created', 'identity_rotated', 
 *                             'identity_burned', 'anomaly_detected', 'mfa_triggered', 'threat_event'
 * @param {string} shieldId - Shield identity ID
 * @param {Object} payload - Event payload data
 * @returns {Promise<{success: boolean, txId?: string, error?: string}>}
 * 
 * @example
 * const result = await logSecurityEvent('identity_created', 'shield_123', {
 *   userId: 'user_456',
 *   proxyEmail: 'proxy@shield.io',
 *   timestamp: new Date().toISOString()
 * });
 */
export async function logSecurityEvent(eventType, shieldId, payload) {
  try {
    // Validate inputs
    if (!eventType || typeof eventType !== 'string') {
      return {
        success: false,
        error: 'eventType is required and must be a string',
      };
    }
    
    if (!shieldId || typeof shieldId !== 'string') {
      return {
        success: false,
        error: 'shieldId is required and must be a string',
      };
    }
    
    // Initialize connection if not already connected
    const contractInstance = await initializeGateway();
    
    // Generate transaction ID
    const txId = generateTxId();
    
    // Prepare event data
    const eventData = {
      txId,
      eventType,
      shieldId,
      payload: typeof payload === 'object' ? payload : { data: payload },
      timestamp: new Date().toISOString(),
    };
    
    // Serialize payload for chaincode
    const eventDataJson = JSON.stringify(eventData);
    
    console.log(`[BlockchainService] Submitting event: ${eventType} for shield: ${shieldId}`);
    
    // Submit transaction to chaincode
    // Chaincode function: LogSecurityEvent(eventType, shieldId, eventDataJson)
    const result = await contractInstance.submitTransaction(
      'LogSecurityEvent',
      eventType,
      shieldId,
      eventDataJson
    );
    
    // Decode result if present
    const resultString = result.toString('utf8');
    let blockchainTxId = txId;
    
    // If chaincode returns a transaction ID, use it
    if (resultString) {
      try {
        const parsedResult = JSON.parse(resultString);
        if (parsedResult.txId) {
          blockchainTxId = parsedResult.txId;
        }
      } catch {
        // Result is not JSON, use generated txId
      }
    }
    
    console.log(`[BlockchainService] Event logged successfully. TxID: ${blockchainTxId}`);
    
    return {
      success: true,
      txId: blockchainTxId,
    };
    
  } catch (error) {
    console.error(`[BlockchainService] Failed to log event:`, error.message);
    
    return {
      success: false,
      error: error.message || 'Unknown blockchain error',
    };
  }
}

/**
 * Query security events by shield ID
 * 
 * @param {string} shieldId - Shield identity ID to query
 * @returns {Promise<{success: boolean, events?: Array, error?: string}>}
 */
export async function queryEventsByShieldId(shieldId) {
  try {
    if (!shieldId) {
      return {
        success: false,
        error: 'shieldId is required',
      };
    }
    
    const contractInstance = await initializeGateway();
    
    // Evaluate (query) transaction - does not modify ledger
    const result = await contractInstance.evaluateTransaction(
      'QueryEventsByShieldId',
      shieldId
    );
    
    const events = JSON.parse(result.toString('utf8'));
    
    return {
      success: true,
      events,
    };
    
  } catch (error) {
    console.error(`[BlockchainService] Query failed:`, error.message);
    
    return {
      success: false,
      error: error.message || 'Query failed',
    };
  }
}

/**
 * Query security events by event type
 * 
 * @param {string} eventType - Event type to query
 * @returns {Promise<{success: boolean, events?: Array, error?: string}>}
 */
export async function queryEventsByType(eventType) {
  try {
    if (!eventType) {
      return {
        success: false,
        error: 'eventType is required',
      };
    }
    
    const contractInstance = await initializeGateway();
    
    const result = await contractInstance.evaluateTransaction(
      'QueryEventsByType',
      eventType
    );
    
    const events = JSON.parse(result.toString('utf8'));
    
    return {
      success: true,
      events,
    };
    
  } catch (error) {
    console.error(`[BlockchainService] Query failed:`, error.message);
    
    return {
      success: false,
      error: error.message || 'Query failed',
    };
  }
}

/**
 * Verify a transaction exists on the blockchain
 * 
 * @param {string} txId - Transaction ID to verify
 * @returns {Promise<{success: boolean, exists?: boolean, event?: Object, error?: string}>}
 */
export async function verifyTransaction(txId) {
  try {
    if (!txId) {
      return {
        success: false,
        error: 'txId is required',
      };
    }
    
    const contractInstance = await initializeGateway();
    
    const result = await contractInstance.evaluateTransaction(
      'GetEventByTxId',
      txId
    );
    
    const resultString = result.toString('utf8');
    
    if (!resultString || resultString === 'null') {
      return {
        success: true,
        exists: false,
      };
    }
    
    const event = JSON.parse(resultString);
    
    return {
      success: true,
      exists: true,
      event,
    };
    
  } catch (error) {
    console.error(`[BlockchainService] Verification failed:`, error.message);
    
    return {
      success: false,
      error: error.message || 'Verification failed',
    };
  }
}

/**
 * Check if blockchain service is connected and healthy
 * 
 * @returns {Promise<{success: boolean, connected: boolean, channel?: string, chaincode?: string}>}
 */
export async function healthCheck() {
  try {
    await initializeGateway();
    
    return {
      success: true,
      connected: true,
      channel: CHANNEL_NAME,
      chaincode: CHAINCODE_NAME,
    };
    
  } catch (error) {
    return {
      success: false,
      connected: false,
      error: error.message,
    };
  }
}

// ---------------------------------------------------------------------------
// Graceful Shutdown Handler
// ---------------------------------------------------------------------------

process.on('SIGINT', async () => {
  await closeGateway();
});

process.on('SIGTERM', async () => {
  await closeGateway();
});

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export default {
  logSecurityEvent,
  queryEventsByShieldId,
  queryEventsByType,
  verifyTransaction,
  healthCheck,
  closeGateway,
};
