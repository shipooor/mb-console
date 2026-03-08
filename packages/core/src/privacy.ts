import type { Storage } from './storage.js';
import type {
  Network,
  Project,
  PrivacyDepositOptions,
  PrivacyResult,
  PrivacyTransferOptions,
  PrivacyWithdrawOptions,
} from './types.js';
import type { PrivacyNamespace } from './client.js';
import type { BlockchainConnection } from './connection.js';
import { generateSignature, assertPubkey } from './utils.js';
import { VALIDATORS } from './config.js';

// ---------------------------------------------------------------------------
// Known devnet SPL token mints
// ---------------------------------------------------------------------------

const KNOWN_MINTS: Record<string, string> = {
  'SOL': 'So11111111111111111111111111111111111111112',
  'USDC': '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Load a project from storage and validate that the privacy feature is enabled.
 */
async function requirePrivacyEnabled(storage: Storage, project: string): Promise<Project> {
  const data = await storage.get(`project:${project}`);
  if (!data) {
    throw new Error(`Project "${project}" not found`);
  }
  const parsed = JSON.parse(data) as Project;
  if (!parsed.features.privacy) {
    throw new Error(
      `Feature "privacy" is not enabled for project "${project}". ` +
        `Enable it with: client.projects.configure("${project}", { features: { privacy: true } })`,
    );
  }
  return parsed;
}

/**
 * Resolve a mint address from either an explicit `mint` option or
 * a well-known token symbol (SOL, USDC).
 */
function resolveMint(token: string, mint?: string): string | undefined {
  if (mint) return mint;
  return KNOWN_MINTS[token.toUpperCase()];
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Create a fully-functional `PrivacyNamespace` backed by the given Storage.
 *
 * When a `getConnection` callback returns a valid `BlockchainConnection`
 * with a signer, real TEE delegation / withdrawal / transfer operations
 * are attempted via the MagicBlock SDK. Falls back to simulated behavior
 * on any error or missing connection.
 */
export function createPrivacyNamespace(
  storage: Storage,
  _network: Network,
  getConnection?: () => BlockchainConnection | undefined,
): PrivacyNamespace {
  return {
    async deposit(options: PrivacyDepositOptions): Promise<PrivacyResult> {
      await requirePrivacyEnabled(storage, options.project);

      if (options.amount <= 0) {
        throw new Error('Deposit amount must be greater than 0');
      }

      // Real blockchain: delegate SPL tokens to TEE validator
      const conn = getConnection?.();
      const mintAddress = resolveMint(options.token, options.mint);

      if (conn?.signer && mintAddress) {
        try {
          const { PublicKey, Transaction, SystemProgram } = await import('@solana/web3.js');
          const {
            getAssociatedTokenAddress,
            createAssociatedTokenAccountInstruction,
            createSyncNativeInstruction,
            NATIVE_MINT,
          } = await import('@solana/spl-token');
          const { delegatePrivateSpl } = await import(
            '@magicblock-labs/ephemeral-rollups-sdk'
          );

          const mintPk = new PublicKey(mintAddress);
          const teeValidator = new PublicKey(VALIDATORS[conn.network].tee);
          const lamports = BigInt(Math.round(options.amount * 1e9));

          const tx = new Transaction();

          // For native SOL: wrap into wSOL before delegating
          const isNativeSol = mintPk.equals(NATIVE_MINT);
          if (isNativeSol) {
            const wsolAta = await getAssociatedTokenAddress(
              NATIVE_MINT,
              conn.signer.publicKey,
            );
            // Create wSOL ATA if it doesn't exist
            const ataInfo = await conn.baseConnection.getAccountInfo(wsolAta);
            if (!ataInfo) {
              tx.add(
                createAssociatedTokenAccountInstruction(
                  conn.signer.publicKey,
                  wsolAta,
                  conn.signer.publicKey,
                  NATIVE_MINT,
                ),
              );
            }
            // Transfer native SOL to wSOL ATA
            tx.add(
              SystemProgram.transfer({
                fromPubkey: conn.signer.publicKey,
                toPubkey: wsolAta,
                lamports,
              }),
            );
            // Sync native balance so SPL token program sees it
            tx.add(createSyncNativeInstruction(wsolAta));
          }

          const instructions = await delegatePrivateSpl(
            conn.signer.publicKey,
            mintPk,
            lamports,
            { validator: teeValidator, delegatePermission: true },
          );

          for (const ix of instructions) {
            tx.add(ix);
          }
          tx.feePayer = conn.signer.publicKey;
          // Delegation happens on the base Solana chain, not the Magic Router
          tx.recentBlockhash = (
            await conn.baseConnection.getLatestBlockhash()
          ).blockhash;

          const signed = await conn.signer.signTransaction(tx);
          const signature = await conn.baseConnection.sendRawTransaction(
            signed.serialize(),
          );

          return { signature, simulated: false };
        } catch (err) {
          console.warn(
            `[mb-console] Real privacy deposit failed, using simulated mode: ${
              err instanceof Error ? err.message : String(err)
            }`,
          );
        }
      }

      return { signature: generateSignature(), simulated: true };
    },

    async transfer(options: PrivacyTransferOptions): Promise<PrivacyResult> {
      await requirePrivacyEnabled(storage, options.project);

      if (options.amount <= 0) {
        throw new Error('Transfer amount must be greater than 0');
      }

      if (!options.to) {
        throw new Error('Transfer recipient address is required');
      }
      assertPubkey(options.to, 'recipient');

      // Real blockchain: SPL transfer via TEE ER connection
      const conn = getConnection?.();
      const mintAddress = resolveMint(options.token, options.mint);

      if (conn?.signer && mintAddress) {
        try {
          const { PublicKey, Transaction } = await import('@solana/web3.js');
          const {
            createAssociatedTokenAccountInstruction,
            createTransferInstruction,
            getAssociatedTokenAddress,
          } = await import('@solana/spl-token');

          const mintPk = new PublicKey(mintAddress);
          const recipientPk = new PublicKey(options.to);
          const lamports = BigInt(Math.round(options.amount * 1e9));

          // Get/create associated token accounts
          const senderAta = await getAssociatedTokenAddress(
            mintPk,
            conn.signer.publicKey,
          );
          const recipientAta = await getAssociatedTokenAddress(
            mintPk,
            recipientPk,
          );

          const tx = new Transaction();

          // Create recipient ATA if needed
          const recipientAtaInfo = await conn.routerConnection.getAccountInfo(
            recipientAta,
          );
          if (!recipientAtaInfo) {
            tx.add(
              createAssociatedTokenAccountInstruction(
                conn.signer.publicKey,
                recipientAta,
                recipientPk,
                mintPk,
              ),
            );
          }

          tx.add(
            createTransferInstruction(
              senderAta,
              recipientAta,
              conn.signer.publicKey,
              lamports,
            ),
          );

          tx.feePayer = conn.signer.publicKey;
          tx.recentBlockhash = (
            await conn.baseConnection.getLatestBlockhash()
          ).blockhash;

          const signed = await conn.signer.signTransaction(tx);
          const signature = await conn.baseConnection.sendRawTransaction(
            signed.serialize(),
          );

          return { signature, simulated: false };
        } catch (err) {
          console.warn(
            `[mb-console] Real privacy transfer failed, using simulated mode: ${
              err instanceof Error ? err.message : String(err)
            }`,
          );
        }
      }

      return { signature: generateSignature(), simulated: true };
    },

    async withdraw(options: PrivacyWithdrawOptions): Promise<PrivacyResult> {
      await requirePrivacyEnabled(storage, options.project);

      if (options.amount <= 0) {
        throw new Error('Withdraw amount must be greater than 0');
      }

      // Real blockchain: withdraw SPL + undelegate from TEE
      const conn = getConnection?.();
      const mintAddress = resolveMint(options.token, options.mint);

      if (conn?.signer && mintAddress) {
        try {
          const { PublicKey, Transaction } = await import('@solana/web3.js');
          const { withdrawSplIx, undelegateIx } = await import(
            '@magicblock-labs/ephemeral-rollups-sdk'
          );

          const mintPk = new PublicKey(mintAddress);
          const lamports = BigInt(Math.round(options.amount * 1e9));

          const withdrawInstruction = withdrawSplIx(
            conn.signer.publicKey,
            mintPk,
            lamports,
          );
          const undelegateInstruction = undelegateIx(
            conn.signer.publicKey,
            mintPk,
          );

          const tx = new Transaction()
            .add(withdrawInstruction)
            .add(undelegateInstruction);

          tx.feePayer = conn.signer.publicKey;
          // Undelegation returns to the base Solana chain
          tx.recentBlockhash = (
            await conn.baseConnection.getLatestBlockhash()
          ).blockhash;

          const signed = await conn.signer.signTransaction(tx);
          const signature = await conn.baseConnection.sendRawTransaction(
            signed.serialize(),
          );

          return { signature, simulated: false };
        } catch (err) {
          console.warn(
            `[mb-console] Real privacy withdraw failed, using simulated mode: ${
              err instanceof Error ? err.message : String(err)
            }`,
          );
        }
      }

      return { signature: generateSignature(), simulated: true };
    },
  };
}
