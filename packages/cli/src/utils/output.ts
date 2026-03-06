// ---------------------------------------------------------------------------
// CLI output formatters
// ---------------------------------------------------------------------------

/**
 * JSON replacer that handles Date and Uint8Array serialization.
 */
function replacer(_key: string, value: unknown): unknown {
  if (value instanceof Date) return value.toISOString();
  if (value instanceof Uint8Array) return Buffer.from(value).toString('hex');
  return value;
}

/** Print any value as pretty-printed JSON. */
export function printJson(data: unknown): void {
  console.log(JSON.stringify(data, replacer, 2));
}

/** Print a success message and exit cleanly. */
export function printSuccess(message: string): void {
  console.log(`\u2713 ${message}`);
}

/** Print an error message and exit with code 1. */
export function printError(message: string): void {
  console.error(`\u2717 ${message}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Table helpers
// ---------------------------------------------------------------------------

interface Column {
  header: string;
  key: string;
  width?: number;
}

/**
 * Print an array of objects as a fixed-width ASCII table.
 *
 * Column widths are auto-calculated from the header width and the widest
 * value in each column, with a minimum of the header length + 2.
 */
export function printTable(rows: Record<string, unknown>[], columns: Column[]): void {
  if (rows.length === 0) {
    console.log('(no results)');
    return;
  }

  // Resolve column widths
  const widths = columns.map((col) => {
    const headerLen = col.header.length;
    const maxDataLen = rows.reduce((max, row) => {
      const val = String(row[col.key] ?? '');
      return Math.max(max, val.length);
    }, 0);
    return col.width ?? Math.max(headerLen, maxDataLen) + 2;
  });

  // Header
  const header = columns.map((col, i) => col.header.padEnd(widths[i]!)).join('  ');
  const separator = widths.map((w) => '-'.repeat(w)).join('  ');

  console.log(header);
  console.log(separator);

  // Rows
  for (const row of rows) {
    const line = columns
      .map((col, i) => String(row[col.key] ?? '').padEnd(widths[i]!))
      .join('  ');
    console.log(line);
  }
}
