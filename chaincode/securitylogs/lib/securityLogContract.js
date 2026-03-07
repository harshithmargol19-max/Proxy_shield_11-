'use strict';

const { Contract } = require('fabric-contract-api');

/**
 * SecurityLogContract — Hyperledger Fabric chaincode for ProxyShield-11.
 *
 * Stores immutable security event records in the world state.
 *
 * Key format:  eventId  (UUID, globally unique)
 * Composite keys for secondary lookups:
 *   - "shield"~shieldId~eventId   → enables getEventsByShield
 *   - "type"~eventType~eventId    → enables getEventsByType
 */
class SecurityLogContract extends Contract {

  constructor() {
    super('SecurityLogContract');
  }

  // -----------------------------------------------------------------------
  // Initialise Ledger (optional, called on chaincode instantiation)
  // -----------------------------------------------------------------------

  async InitLedger(ctx) {
    console.info('[SecurityLogContract] Ledger initialised');
  }

  // -----------------------------------------------------------------------
  // 1. logEvent — Write a security event to the ledger
  // -----------------------------------------------------------------------

  /**
   * Store a security event in world state.
   *
   * @param {Context} ctx        - Fabric transaction context
   * @param {string}  eventId    - UUID for this event
   * @param {string}  eventType  - Event category (identity_created, anomaly_detected, etc.)
   * @param {string}  shieldId   - Shield identity ID this event relates to
   * @param {string}  payload    - JSON-encoded event metadata
   * @param {string}  timestamp  - ISO 8601 timestamp
   * @returns {string} JSON of the stored event
   */
  async logEvent(ctx, eventId, eventType, shieldId, payload, timestamp) {
    // --- Validate required params -------------------------------------------
    if (!eventId)   throw new Error('eventId is required');
    if (!eventType) throw new Error('eventType is required');
    if (!shieldId)  throw new Error('shieldId is required');
    if (!timestamp) throw new Error('timestamp is required');

    // --- Check for duplicate eventId ----------------------------------------
    const existing = await ctx.stub.getState(eventId);
    if (existing && existing.length > 0) {
      throw new Error(`Event ${eventId} already exists on the ledger`);
    }

    // --- Parse payload (validate JSON) --------------------------------------
    let parsedPayload;
    try {
      parsedPayload = JSON.parse(payload);
    } catch {
      parsedPayload = { raw: payload };
    }

    // --- Build ledger record ------------------------------------------------
    const event = {
      eventId,
      eventType,
      shieldId,
      payload: parsedPayload,
      timestamp,
      docType: 'securityEvent',          // CouchDB doc type for rich queries
      txId: ctx.stub.getTxID(),           // Fabric transaction ID
    };

    // --- Store primary key --------------------------------------------------
    await ctx.stub.putState(eventId, Buffer.from(JSON.stringify(event)));

    // --- Store composite keys for secondary lookups -------------------------
    const shieldKey = ctx.stub.createCompositeKey('shield', [shieldId, eventId]);
    await ctx.stub.putState(shieldKey, Buffer.from('\u0000'));

    const typeKey = ctx.stub.createCompositeKey('type', [eventType, eventId]);
    await ctx.stub.putState(typeKey, Buffer.from('\u0000'));

    // --- Emit chaincode event for external listeners ------------------------
    ctx.stub.setEvent('SecurityEvent', Buffer.from(JSON.stringify({
      eventId,
      eventType,
      shieldId,
      timestamp,
    })));

    console.info(`[SecurityLogContract] Logged event ${eventId} (${eventType}) for shield ${shieldId}`);

    return JSON.stringify(event);
  }

  // -----------------------------------------------------------------------
  // 2. getEvent — Read a single event by eventId
  // -----------------------------------------------------------------------

  /**
   * Retrieve a security event from world state.
   *
   * @param {Context} ctx      - Fabric transaction context
   * @param {string}  eventId  - UUID of the event to retrieve
   * @returns {string} JSON of the event, or error if not found
   */
  async getEvent(ctx, eventId) {
    if (!eventId) throw new Error('eventId is required');

    const eventBytes = await ctx.stub.getState(eventId);

    if (!eventBytes || eventBytes.length === 0) {
      throw new Error(`Event ${eventId} does not exist`);
    }

    return eventBytes.toString();
  }

  // -----------------------------------------------------------------------
  // 3. getEventsByShield — All events for a shield identity
  // -----------------------------------------------------------------------

  /**
   * Query all security events associated with a shield identity.
   *
   * Uses composite key "shield"~shieldId to iterate matching event IDs,
   * then fetches each full event record.
   *
   * @param {Context} ctx       - Fabric transaction context
   * @param {string}  shieldId  - Shield identity ID
   * @returns {string} JSON array of events
   */
  async getEventsByShield(ctx, shieldId) {
    if (!shieldId) throw new Error('shieldId is required');

    const iterator = await ctx.stub.getStateByPartialCompositeKey('shield', [shieldId]);
    const events = await this._collectEventsFromCompositeKey(ctx, iterator);

    return JSON.stringify(events);
  }

  // -----------------------------------------------------------------------
  // 4. getEventsByType — All events of a given type
  // -----------------------------------------------------------------------

  /**
   * Query all security events of a specific type.
   *
   * Uses composite key "type"~eventType to iterate matching event IDs,
   * then fetches each full event record.
   *
   * @param {Context} ctx        - Fabric transaction context
   * @param {string}  eventType  - Event type to filter by
   * @returns {string} JSON array of events
   */
  async getEventsByType(ctx, eventType) {
    if (!eventType) throw new Error('eventType is required');

    const iterator = await ctx.stub.getStateByPartialCompositeKey('type', [eventType]);
    const events = await this._collectEventsFromCompositeKey(ctx, iterator);

    return JSON.stringify(events);
  }

  // -----------------------------------------------------------------------
  // 5. getEventByTxId — Lookup event by Fabric transaction ID
  // -----------------------------------------------------------------------

  /**
   * Query event by the Fabric transaction ID stored inside the record.
   * Falls back to a full scan via getStateByRange (use sparingly).
   *
   * @param {Context} ctx   - Fabric transaction context
   * @param {string}  txId  - Fabric transaction ID
   * @returns {string} JSON of the matching event, or "null"
   */
  async GetEventByTxId(ctx, txId) {
    if (!txId) throw new Error('txId is required');

    // CouchDB rich query (requires CouchDB as state database)
    const queryString = JSON.stringify({
      selector: { docType: 'securityEvent', txId },
      use_index: ['_design/indexTxIdDoc', 'indexTxId'],
    });

    const iterator = await ctx.stub.getQueryResult(queryString);
    const results = [];

    let res = await iterator.next();
    while (!res.done) {
      if (res.value && res.value.value) {
        results.push(JSON.parse(res.value.value.toString('utf8')));
      }
      res = await iterator.next();
    }
    await iterator.close();

    return results.length > 0 ? JSON.stringify(results[0]) : 'null';
  }

  // -----------------------------------------------------------------------
  // 6. QueryEventsByShieldId — CouchDB rich query alias
  // -----------------------------------------------------------------------

  /**
   * Rich query alias used by blockchainService.queryEventsByShieldId().
   */
  async QueryEventsByShieldId(ctx, shieldId) {
    return this.getEventsByShield(ctx, shieldId);
  }

  // -----------------------------------------------------------------------
  // 7. QueryEventsByType — CouchDB rich query alias
  // -----------------------------------------------------------------------

  /**
   * Rich query alias used by blockchainService.queryEventsByType().
   */
  async QueryEventsByType(ctx, eventType) {
    return this.getEventsByType(ctx, eventType);
  }

  // -----------------------------------------------------------------------
  // 8. LogSecurityEvent — Alias used by blockchainService.logSecurityEvent()
  // -----------------------------------------------------------------------

  /**
   * Gateway-facing alias.  Accepts (eventType, shieldId, eventDataJson)
   * and extracts eventId + timestamp from the JSON payload.
   */
  async LogSecurityEvent(ctx, eventType, shieldId, eventDataJson) {
    let data;
    try {
      data = JSON.parse(eventDataJson);
    } catch {
      throw new Error('eventDataJson must be valid JSON');
    }

    const eventId   = data.event_id || data.txId || ctx.stub.getTxID();
    const timestamp = data.timestamp || new Date().toISOString();

    return this.logEvent(ctx, eventId, eventType, shieldId, eventDataJson, timestamp);
  }

  // -----------------------------------------------------------------------
  // Private Helpers
  // -----------------------------------------------------------------------

  /**
   * Iterate a composite-key iterator, extract the eventId from each
   * composite key, fetch the full event, and return an array.
   */
  async _collectEventsFromCompositeKey(ctx, iterator) {
    const events = [];

    let res = await iterator.next();
    while (!res.done) {
      if (res.value && res.value.key) {
        // Decompose "objectType~attr1~attr2" → get eventId (last attribute)
        const compositeKey = ctx.stub.splitCompositeKey(res.value.key);
        const eventId = compositeKey.attributes[compositeKey.attributes.length - 1];

        // Fetch full event record by primary key
        const eventBytes = await ctx.stub.getState(eventId);
        if (eventBytes && eventBytes.length > 0) {
          events.push(JSON.parse(eventBytes.toString('utf8')));
        }
      }

      res = await iterator.next();
    }

    await iterator.close();
    return events;
  }
}

module.exports = SecurityLogContract;
