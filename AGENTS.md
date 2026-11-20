# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

- `startos/manifest/index.ts` adds `opticalDrives: true` after `setupManifest`, because the
  published SDK does not know the field yet. A `start-cli` that does not know it drops the key
  while packing and the s9pk silently ships without drive access; `build.yml` packs with a
  `start-cli` built from the branch that adds it.
- `ARCHES` is `x86` only until an `aarch64` `start-cli` with that field is available.
