import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const payload = fs.readFileSync(path.join(dir, 'catalog.json'));
const catalog = JSON.parse(payload);
if (catalog.schemaVersion !== 1 || !Number.isInteger(catalog.revision) || catalog.revision < 1 ||
    !Array.isArray(catalog.sources) || catalog.sources.length > 128 || !catalog.sources.length) throw Error('Invalid catalog');
const ids = catalog.sources.map(s => s.bookSourceKey || s.bookSourceUrl);
if (new Set(ids).size !== ids.length) throw Error('Duplicate source identity');
const keys = JSON.parse(fs.readFileSync(path.join(dir, 'public-keys.json')));
const keyId = process.env.IOS_RULE_SIGNING_KEY_ID || 'aurora-ios-20261114-1';
const context = Buffer.from('AuroraReader.rules.v1\0');
const message = Buffer.concat([context, payload]);
const verifyOnly = process.argv.includes('--verify');
if (verifyOnly) {
  const envelope = JSON.parse(fs.readFileSync(path.join(dir, 'catalog.signed.json')));
  const pub = crypto.createPublicKey({key: Buffer.concat([Buffer.from('302a300506032b6570032100', 'hex'), Buffer.from(keys[envelope.keyId], 'base64')]), format: 'der', type: 'spki'});
  if (envelope.formatVersion !== 1 || envelope.algorithm !== 'Ed25519' ||
      !Buffer.from(envelope.payload, 'base64').equals(payload) ||
      !crypto.verify(null, message, pub, Buffer.from(envelope.signature, 'base64'))) throw Error('Invalid signature or stale signed catalog');
} else {
  const keyFileIndex = process.argv.indexOf('--key-file');
  const pem = process.env.IOS_RULE_SIGNING_PRIVATE_KEY || (keyFileIndex >= 0 ? fs.readFileSync(process.argv[keyFileIndex + 1]) : undefined);
  if (!pem) throw Error('Set IOS_RULE_SIGNING_PRIVATE_KEY; private keys must never be committed');
  const privateKey = crypto.createPrivateKey(pem);
  const publicRaw = crypto.createPublicKey(privateKey).export({format: 'der', type: 'spki'}).subarray(-32).toString('base64');
  if (keys[keyId] !== publicRaw) throw Error('Private key does not match published key');
  const envelope = {formatVersion: 1, keyId, algorithm: 'Ed25519', payload: payload.toString('base64'), signature: crypto.sign(null, message, privateKey).toString('base64')};
  fs.writeFileSync(path.join(dir, 'catalog.signed.json'), JSON.stringify(envelope, null, 2) + '\n');
}
console.log(`Verified revision ${catalog.revision}, ${catalog.sources.length} sources; key ${keyId}`);
