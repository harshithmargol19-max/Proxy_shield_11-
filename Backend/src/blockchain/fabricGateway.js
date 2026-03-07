/**
 * Fabric Gateway Helper for ProxyShield-11
 *
 * Resolves crypto material from the local test-network and builds
 * a ready-to-use Fabric Gateway connection.
 *
 * Expected test-network layout (after ./network.sh up createChannel):
 *   fabric-samples/test-network/organizations/
 *     peerOrganizations/org1.example.com/
 *       users/User1@org1.example.com/msp/
 *         signcerts/cert.pem
 *         keystore/*_sk
 *       peers/peer0.org1.example.com/tls/ca.crt
 */

import { connect, signers } from '@hyperledger/fabric-gateway';
import * as grpc from '@grpc/grpc-js';
import * as crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..');

// Default: fabric-samples/test-network inside the repo
const FABRIC_SAMPLES = process.env.FABRIC_SAMPLES_PATH
  || path.join(PROJECT_ROOT, 'fabric-samples');

const TEST_NETWORK  = path.join(FABRIC_SAMPLES, 'test-network');
const CRYPTO_PATH   = path.join(TEST_NETWORK, 'organizations', 'peerOrganizations', 'org1.example.com');
const WALLET_DIR    = path.join(__dirname, 'wallet');

// ---------------------------------------------------------------------------
// Network Config
// ---------------------------------------------------------------------------

const CHANNEL_NAME   = process.env.FABRIC_CHANNEL   || 'proxyshield-channel';
const CHAINCODE_NAME = process.env.FABRIC_CHAINCODE  || 'securitylogs';
const MSP_ID         = process.env.FABRIC_MSP_ID     || 'Org1MSP';
const PEER_ENDPOINT  = process.env.FABRIC_PEER_ENDPOINT       || 'localhost:7051';
const PEER_HOST_ALIAS = process.env.FABRIC_PEER_HOST_ALIAS    || 'peer0.org1.example.com';

// ---------------------------------------------------------------------------
// Crypto Material Loaders
// ---------------------------------------------------------------------------

/**
 * Load the user certificate from test-network.
 */
async function loadCertificate() {
  const certDir = path.join(
    CRYPTO_PATH, 'users', 'User1@org1.example.com', 'msp', 'signcerts',
  );
  const certFile = (await fs.readdir(certDir))[0];
  return await fs.readFile(path.join(certDir, certFile), 'utf8');
}

/**
 * Load the user private key from test-network.
 */
async function loadPrivateKey() {
  const keyDir = path.join(
    CRYPTO_PATH, 'users', 'User1@org1.example.com', 'msp', 'keystore',
  );
  const keyFile = (await fs.readdir(keyDir))[0];
  const keyPem  = await fs.readFile(path.join(keyDir, keyFile), 'utf8');
  return crypto.createPrivateKey(keyPem);
}

/**
 * Load peer TLS CA certificate.
 */
async function loadTlsCert() {
  const tlsCertPath = path.join(
    CRYPTO_PATH, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt',
  );
  return await fs.readFile(tlsCertPath);
}

// ---------------------------------------------------------------------------
// Wallet Helpers  (persist cert + key for blockchainService.js)
// ---------------------------------------------------------------------------

/**
 * Copy test-network identity into Backend/src/blockchain/wallet/
 * so blockchainService.js can also load it.
 */
async function populateWallet() {
  const identityDir = path.join(WALLET_DIR, 'appUser');
  await fs.mkdir(identityDir, { recursive: true });

  const cert = await loadCertificate();
  await fs.writeFile(path.join(identityDir, 'cert.pem'), cert);

  const keyDir = path.join(
    CRYPTO_PATH, 'users', 'User1@org1.example.com', 'msp', 'keystore',
  );
  const keyFile = (await fs.readdir(keyDir))[0];
  const keyPem  = await fs.readFile(path.join(keyDir, keyFile), 'utf8');
  await fs.writeFile(path.join(identityDir, 'key.pem'), keyPem);

  // Also copy TLS cert
  const tlsDir = path.join(WALLET_DIR, 'tls');
  await fs.mkdir(tlsDir, { recursive: true });
  const tlsCert = await loadTlsCert();
  await fs.writeFile(path.join(tlsDir, 'ca.crt'), tlsCert);

  console.log('[FabricGateway] Wallet populated from test-network');
}

// ---------------------------------------------------------------------------
// Gateway Connection
// ---------------------------------------------------------------------------

let _gateway  = null;
let _client   = null;
let _contract = null;

/**
 * Create gRPC connection to the Fabric peer.
 */
async function newGrpcConnection() {
  const tlsRootCert = await loadTlsCert();
  const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
  return new grpc.Client(PEER_ENDPOINT, tlsCredentials, {
    'grpc.ssl_target_name_override': PEER_HOST_ALIAS,
  });
}

/**
 * Connect to the Fabric Gateway and return the contract handle.
 *
 * @returns {{ gateway, contract, channelName, chaincodeName }}
 */
export async function connectGateway() {
  if (_gateway && _contract) {
    return { gateway: _gateway, contract: _contract, channelName: CHANNEL_NAME, chaincodeName: CHAINCODE_NAME };
  }

  const certificate = await loadCertificate();
  const privateKey  = await loadPrivateKey();
  const signer      = signers.newPrivateKeySigner(privateKey);

  _client = await newGrpcConnection();

  _gateway = connect({
    client: _client,
    identity: { mspId: MSP_ID, credentials: Buffer.from(certificate) },
    signer,
    evaluateOptions:    () => ({ deadline: Date.now() + 5000 }),
    endorseOptions:     () => ({ deadline: Date.now() + 15000 }),
    submitOptions:      () => ({ deadline: Date.now() + 5000 }),
    commitStatusOptions: () => ({ deadline: Date.now() + 60000 }),
  });

  const network = _gateway.getNetwork(CHANNEL_NAME);
  _contract = network.getContract(CHAINCODE_NAME);

  console.log(`[FabricGateway] Connected → channel: ${CHANNEL_NAME}, chaincode: ${CHAINCODE_NAME}`);
  return { gateway: _gateway, contract: _contract, channelName: CHANNEL_NAME, chaincodeName: CHAINCODE_NAME };
}

/**
 * Disconnect the gateway (graceful shutdown).
 */
export async function disconnectGateway() {
  if (_gateway) { _gateway.close(); _gateway = null; _contract = null; }
  if (_client)  { _client.close(); _client = null; }
  console.log('[FabricGateway] Disconnected');
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export {
  populateWallet,
  loadCertificate,
  loadPrivateKey,
  loadTlsCert,
  CHANNEL_NAME,
  CHAINCODE_NAME,
  MSP_ID,
  CRYPTO_PATH,
  WALLET_DIR,
};

export default {
  connectGateway,
  disconnectGateway,
  populateWallet,
};
