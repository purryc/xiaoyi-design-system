# Xiaoyi Design System

## Purpose and design context
Reconstruct Xiaoyi for shinoyan's UX design, interface prototyping, and reusable research. The supplied Xiaoyi screenshots and recordings are the visual authority: calm light surfaces, restrained typography, contextual assistant sheets, and the observed blue-violet orb. Do not redesign the brand. This is an independent research reconstruction, not Huawei's official design specification.

## Structure
- `src/`: reusable React components, styles, and documentation application.
- `tokens/`: editable design tokens; distinguish observed structure from estimated numeric values.
- `public/reference/`: small derived reference previews with traceable source IDs, never altered originals.
- `reference/manifest.json`: inventory of every local source, SHA-256, dimensions, duration and provenance.
- `docs/`: evidence, component specifications, state models, coverage and verification.
- `scripts/`: reproducible inventory, validation and browser checks.
- `qa/`: local visual verification results (ignored by Git).
Original media stays in `../小艺/`; do not rename, modify, or duplicate original bytes. Derivative thumbnails and sampled frames are documented exceptions for the portable research catalog. Filenames for new code and docs are English kebab-case. Temporary render files belong in ignored `qa/`.

## Evidence and implementation
Use all supplied media in the reference index. Record unknown OS/app versions as unknown. Use official sources first for supplemental behavior. Never promote video search snippets to verified visual evidence. Exact radii, spacing, colors and timing are reconstruction estimates unless measured. Keep demonstration data fictional and mark simulation in documentation. Do not request microphone/camera access in demos. Match actual observed scrim per surface; do not apply a global scrim rule across versions.
Keep interaction instructions in documentation, not reproduced product screens. Preserve keyboard usability, focus visibility, responsive layout and reduced-motion support. Verify production build, reference integrity, demo transitions and visual output before delivery.

## GitHub
The user requested a GitHub project containing this system; creation and initial push are authorized. Use a private repository by default. Track code, specs, tokens, evidence metadata and compact reference derivatives. Exclude original videos, node_modules, local paths with secrets, and generated build/QA output. No deployment or auto-merge is implied.
