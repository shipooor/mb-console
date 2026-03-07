// Buffer polyfill for Solana packages (@solana/web3.js, @magicblock-labs/ephemeral-rollups-sdk)
// that expect Node.js Buffer global in the browser.
import { Buffer } from 'buffer';

if (typeof globalThis.Buffer === 'undefined') {
  globalThis.Buffer = Buffer;
}
