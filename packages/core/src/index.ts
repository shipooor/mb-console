export const VERSION = '0.1.0';

export { createClient, ConsoleClient } from './client.js';
export type {
  ProjectsNamespace,
  ErNamespace,
  VrfNamespace,
  PrivacyNamespace,
  CranksNamespace,
  OracleNamespace,
  MonitorNamespace,
  NamespaceOverrides,
} from './client.js';

export * from './types.js';
export * from './config.js';

export { MemoryStorage, FileStorage, BrowserStorage } from './storage.js';
export type { Storage } from './storage.js';

export {
  createKeypairSigner,
  createBlockchainConnection,
  createReadOnlyConnection,
} from './connection.js';
export type {
  BlockchainConnection,
  SolanaSignerAdapter,
} from './connection.js';

export { createProjectsNamespace } from './projects.js';
export { createErNamespace } from './er.js';
export { createVrfNamespace, vrf } from './vrf.js';
export { createPrivacyNamespace } from './privacy.js';
export { createCranksNamespace } from './cranks.js';
export { createOracleNamespace } from './oracle.js';
export { createMonitorNamespace, appendLog } from './monitor.js';
export { generateSignature, generateBase58, isValidPubkey, assertPubkey } from './utils.js';
