// scripts/editorial/write.ts
// Phase 50 — atomic temp+rename writer + optional dual-write mirror (WRIT-03..05).
// SCAF-08 forbidden in this directory (see .planning/REQUIREMENTS.md SCAF-08):
//   - path-alias imports (use relative paths)
//   - non-deterministic timestamp APIs (use injected/fixed timestamps)
//   - platform-specific line endings (use literal newline only)
//   - parallel iteration over the ordered route list (use sequential for-of)

import * as fsp from 'node:fs/promises'
import * as nodePath from 'node:path'
import type { EditorialConfig } from './config.ts'

const MIRROR_RELATIVE_PATH = '.planning/research/site-editorial-capture.md'

/**
 * atomicWrite — write content to a PID-suffixed temp file, then rename
 * over the destination. The rename is atomic on POSIX (and WSL is POSIX),
 * so concurrent readers (e.g., Obsidian's filewatcher) never observe a
 * half-written file.
 *
 * WRIT-03: UTF-8 encoding explicit; literal-newline-only line endings are
 * the caller's responsibility (Phase 50 document assembler emits native
 * line endings). This function does not transform line endings.
 *
 * On write or rename failure, the temp file is best-effort removed so
 * accidental re-runs don't accumulate stale sibling temp files.
 */
export async function atomicWrite(absPath: string, content: string): Promise<void> {
  const temp = `${absPath}.tmp-${process.pid}`
  try {
    await fsp.writeFile(temp, content, { encoding: 'utf8' })
    await fsp.rename(temp, absPath)
  } catch (err) {
    await fsp.unlink(temp).catch(() => undefined)
    throw err
  }
}

/**
 * writePrimaryAndMirror — always writes the primary output file; optionally
 * mirrors the same content to `.planning/research/site-editorial-capture.md`
 * when `config.mirror === true`.
 *
 * Primary write failure rejects the whole function (primary is load-bearing).
 * Mirror write failure is logged to stderr and silently absorbed —
 * the mirror is OPTIONAL per WRIT-05, and losing the repo-scoped copy
 * should not fail an otherwise-successful capture run.
 *
 * Returns the absolute path of each file actually written. `mirrorPath`
 * is undefined when mirror was not requested OR when the mirror write
 * failed.
 */
export async function writePrimaryAndMirror(
  config: EditorialConfig,
  content: string,
): Promise<{ readonly primaryPath: string; readonly mirrorPath?: string }> {
  await atomicWrite(config.outputPath, content)

  if (config.mirror !== true) {
    return { primaryPath: config.outputPath }
  }

  const mirrorPath = nodePath.resolve(process.cwd(), MIRROR_RELATIVE_PATH)
  try {
    await fsp.mkdir(nodePath.dirname(mirrorPath), { recursive: true })
    await atomicWrite(mirrorPath, content)
    return { primaryPath: config.outputPath, mirrorPath }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    process.stderr.write(`[editorial-capture] mirror write failed: ${message}\n`)
    return { primaryPath: config.outputPath }
  }
}
