// scripts/editorial/index.ts
// Phase 46 placeholder — real orchestrator wires in Phase 50 (SHAP-* + WRIT-*).
// SCAF-08 forbidden in this directory (see .planning/REQUIREMENTS.md SCAF-08):
//   - path-alias imports (use relative paths)
//   - non-deterministic timestamp APIs (use injected/fixed timestamps)
//   - platform-specific line endings (use literal newline only)
//   - parallel iteration over the ordered route list (use sequential for-of)
// tsconfig.editorial.json enforces alias-bans via empty paths.

const PLACEHOLDER_BANNER = '<!-- editorial capture tool — phase 46 scaffold placeholder -->'

function main(): void {
  // Phase 46 ships the directory + build wiring only. Phases 47-50 replace this
  // with: load config -> build routes -> launch playwright -> convert -> write.
  process.stdout.write(`${PLACEHOLDER_BANNER}\n`)
}

main()
