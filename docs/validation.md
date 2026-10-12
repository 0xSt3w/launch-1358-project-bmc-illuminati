# Revision validation — 2026-10-12

## Scope and outcome

**Complete for the bounded source/export revision.** Evaluated all 12 supplied
findings, reproduced their underlying causes, and applied targeted corrections.
The accepted React/Vite/wagmi implementation and its economics are retained.
Detailed per-finding answers are in the root `.imd-responses.json` for the worker
to ingest. This report records worker checks, not independent certification.

**Public delivery remains incomplete:** no preview CID/eth.limo address or GitHub
URL has been issued; owner images and their download URLs are absent; future
financial integrations remain unset. The current `og:image` is a local PNG until
the publisher supplies a public URL. README contains the exact handoff and
configuration steps. No funds, contracts or tokens were moved or deployed.

## Reproduction and corrections

Measurements below came from Chromium 154.0.8037.0 through Playwright 1.64.0. The assigned
browser MCP initially opened a blank page, then returned `Transport closed` for
navigation, resize and evaluation. The fallback used the installed Chromium
headless shell with a local server. Font metrics differ from the reviewer's
machine, so reproduced overflow is larger, but the cause is the same.

| Finding | Evidence before the change | Correction and recheck |
| --- | --- | --- |
| `0b79209f…` high, wallet chain | The mock provider returned `0x89`; the old export showed `Connected:`, no alert, no warning dot, and no switch button. `0x1` had identical output. | `web/src/components/WalletButton.tsx:12` and `:65` read `useAccount().chainId`. Configured chains, connector, transport, `CHAIN_ID` and `useSwitchChain` are unchanged. Eight Mainnet/Polygon cases at 320/390/1024/1440 pass, including switching, emitted chain changes, disconnect and disabled swap. No transaction/signature/approval RPC methods were requested. |
| `893e55e8…` high, input overflow | At both 320 and 390, Swap's document width was 454px and Burns' 451px. Inputs measured about 301/296px. | `web/src/styles.css:709` adds `width: 0` alongside flex/min-width. Both pages now have document width equal to viewport. All seven routes pass at five widths. |
| `3b2cc845…` high, muted text | `#6b7686` contrast computes as 4.378:1 on `#05070b`, 4.067:1 on the stated composited `rgb(13,18,29)` card. Both fail 4.5:1 for 13px text. | `web/src/styles.css:34` maps muted text to `--gray-300` (`#9aa6b5`). Same pairs: 8.156:1 and 7.576:1. Additional rendered-background samples are below. |
| `21fdac97…` high, delivery documentation | No root/web README or publication steps; only the brand-image notes existed. No supplied public address was found in the task inputs. | Root `README.md` now covers installation, build/typecheck/test/preview, IPFS pinning, ENS contenthash, GitHub handoff, configuration, missing assets, publication status and free-check limitation. No deployment was represented as completed. |
| `fd6731dc…` medium, in-page links | Enter on the skip link from Staking set `#main` and rendered Home. The buyback link set `#buybacks` and also rendered Home. | `web/src/App.tsx:41` and `web/src/pages/Burns.tsx:102` prevent route-hash changes and explicitly focus/scroll their targets. `SectionHead` anchors are programmatically focusable. Keyboard tests retain `#/staking`/`#/burns` and focus `main`/`buybacks`. Router fallback behavior is unchanged. |
| `6964a0c1…` medium, duplicate desktop menu | Desktop toggle computed `display:flex`; clicking it created two Main navigations. | `web/src/styles.css:424` uses the more specific toggle selector and hides mobile navigation at desktop widths. The header wraps when the newly functioning network-switch controls require space; this also fixed a 1094px connected-wallet overflow found at 1024 during recheck. Normal Mainnet/disconnected desktop states preserve one navigation. |
| `603c9b00…` medium, heading badges | Found 20 badges directly preceding h1–h4 across seven routes (4/4/1/4/5/1/1). The Staking-only 320px overflow did not reproduce on this machine, but the repeated heading bars did. | Removed those badges in `web/src/pages/`. Preserved phase/collection/burn information in headings or prose; retained contextual hero, rarity and integration-status badges. Final DOM count above headings is zero on every route. |
| `2faa755b…` medium, share assets | Metadata pointed at `./og.svg`; no Twitter image or PNG icon existed. | `web/index.html:13` uses a 1200×630 PNG, adds Twitter image metadata and a 32×32 PNG icon. SVG sources remain. `web/vite.config.ts:6` accepts actual public site/image URLs and generates absolute metadata. Nine Node tests include sizes, local fallback, absolute URL/subpath, override precedence and invalid URL rejection. Publication URL and real social-crawler unfurling remain pending. |
| `4ea9339c…` medium, official image placements | Both files/URLs absent; hero announced official-looking alt text for a placeholder. Source had no token/Staking marks or ecosystem image slot. | `web/src/pages/Home.tsx:42` labels the fallback honestly; Home/Dashboard token and Staking headings now reuse 36px Emblems. Home conditionally renders the official pyramid background. `web/src/config/brand.ts:15` retains `officialImages:false`, with exact `BMC IMD.png` filename encoded in its URL. The actual supplied-art branch cannot be visually approved until assets arrive; no replacement art was commissioned. |
| `cead8574…` medium, repeated availability copy | Staking had 19 “coming soon” occurrences and three nested notices; PASS had one nested notice. Internal job IDs were rendered repeatedly. | `web/src/components/ui.tsx:69` no longer renders job IDs. `Staking.tsx:66` provides one shared notice, Swap/Burns intros are shorter, redundant Swap closing notice is removed, PASS notice is outside its card. No nested `.card .notice` remains. Required stats, disabled actions and financial caveats are retained. |
| `01706ed5…` low, font weights | Browser found 400/500/600/700; Inter/JetBrains were CSS names without font assets. | Three 500 declarations became 600; unloaded family names were removed. Browser finds only 400/600/700 across all routes. System font stacks and existing size roles are documented. |
| `dcad5c1e…` low, payout claim | Home said everything paid out in BMC while Swap offered BMC→ETH and the burn center paid nothing. | `web/src/pages/Home.tsx:55` limits the claim to staking rewards. Sell BMC still displays ETH as the receive asset. |

One additional accessibility issue surfaced while reviewing the affected Staking
page: its horizontal reward table was not keyboard focusable (axe
`scrollable-region-focusable`). `web/src/pages/Staking.tsx:82` now gives its wrapper
`tabIndex=0`, `role=region`, and the existing heading as its accessible name. The
final scan no longer reports that finding.

## Six-domain Better Interface coverage

| Domain | Coverage and evidence | Limits |
| --- | --- | --- |
| Accessibility | **Checked:** native controls/labels, network alert, keyboard skip/buyback targets, mobile menu Escape/focus return, FAQ keyboard activation, visible skip focus screenshot, reduced motion, disabled financial controls, axe WCAG A/AA/2.1 AA tags on seven routes. | No screen-reader session, forced-colors session, physical device or native browser zoom test. Axe is not an accessibility certification. |
| Layout | **Checked:** 35 route/viewport measurements at 320/390/768/1024/1440, Home product/main action inside the 390×844 first screen, card/input reflow, desktop and mobile menus, connected-wallet header wrapping, contained table scrolling. | No exhaustive device matrix, RTL or pseudo-localization. Only English/dark mode exists. |
| Writing | **Checked:** repeated integration copy, source-vs-placeholder labels, no invented destinations, phase/rarity/burn wording retained, payout claim narrowed to staking, job IDs moved to docs. | Did not conduct a fresh on-chain liquidity audit or substantiate new economics; this is a revision of the existing informational UI. |
| Typography | **Checked:** three computed weights, system stacks, caption sizes, responsive screenshots, long contract links and amount fields. | Platform-specific glyph metrics vary. Existing non-token input sizes remain; this is not a typography redesign. |
| Colors | **Checked:** muted-token correction, computed ratios, rendered background samples for captions/notes, visible selected/warning states with text cues. | Full animated-canvas/gradient contrast at every point and contrast of missing official imagery are unverified. Axe reports color-contrast incompletes on each page. |
| UI | **Checked:** preserved cards/glows/triangles, consolidated notices, true disabled states, segmented controls, unavailable data, intro skipping, reduced-motion absence of canvas/intro, local image bytes. | No 10%-speed animation-panel walkthrough or physical touch test; missing official images and public share crawlers remain unreviewed. |

### Caption contrast evidence

At 390×844 with reduced motion, screenshot backgrounds were sampled beneath the
text after temporarily making only that element's text transparent. Ratios use
the browser-computed `rgb(154,166,181)` foreground and the least favorable sampled
pixel within each text box (first label line for the footer, excluding its link).
The source/export was not changed for this measurement.

| Text sample | Worst sampled backdrop | New ratio | Old token on same backdrop |
| --- | --- | --- | --- |
| PASS: Live count after launch | `rgb(13,17,29)` | 7.619:1 | 4.090:1 |
| PASS: Mint progress caption | `rgb(5,11,18)` | 7.992:1 | 4.290:1 |
| Swap: Configured in src/config/contracts.ts | `rgb(13,17,29)` | 7.619:1 | 4.090:1 |
| Footer: BMC token on Ethereum Mainnet | `rgb(4,15,21)` | 7.835:1 | 4.206:1 |

These are bounded samples, not a blanket contrast claim for every animation frame.

## Actual commands and results

- `npm ci --prefix /tmp/bmc-revision/web --cache /tmp/bmc-revision/npm-cache --no-audit --no-fund`: exit 0, 526 packages from the existing lockfile. Existing transitive React peer/deprecation warnings were reported. No runtime dependency or lockfile change was required.
- `npm run typecheck --prefix /tmp/bmc-revision/web`: exit 0 (`tsc --noEmit`).
- `npm run build --prefix /tmp/bmc-revision/web`: exit 0 with Vite 7.3.7; about 480KB of JS/CSS and 1.65KB HTML, plus local images. Rollup removed invalid PURE annotations in transitive dependencies; no build failure. The clean output was copied to repository-root `dist/` after the final source change.
- `npm test --prefix /tmp/bmc-revision/web`: exit 0, **9 tests pass**, including mint arithmetic, routing/formatting, relative asset integrity, PNG headers/dimensions and publication-metadata configuration.
- `PLAYWRIGHT_MODULE=/tmp/bmc-revision/browser/node_modules/playwright/index.mjs CHROMIUM_PATH=/opt/imd-tools/ms-playwright/chromium_headless_shell-1246/chrome-headless-shell-linux64/chrome-headless-shell AXE_MODULE=/tmp/bmc-revision/browser/node_modules/@axe-core/playwright/dist/index.mjs BMC_CHECK_OUTPUT=test/scratch/final node web/test/browser-check.mjs`: exit 0, **35 layout checks, 8 wallet scenarios, 8 interaction groups**. Server uses `/preview/` to check subpath asset resolution. Zero captured page exceptions or local resource HTTP failures. External RPC requests are intentionally aborted for unavailable-data tests; this does not establish live RPC uptime or an error-free network console.
- axe-core 4.13.0: **zero reported violations** on seven routes under the selected tags. Color-contrast incompletes remain on every route; Swap also has an `aria-prohibited-attr` incomplete associated with its labelled group. These are manual-review limitations, not passes.
- PNGs were rasterized locally from the existing SVG files using Chromium canvas; dimensions and bytes were checked and the share card visually inspected. No AI substitute was generated.
- `git diff --check`: exit 0. Dependencies/caches are outside the repository, no ignore file was changed, no submodule was introduced, and the final file inventory is under the 8MiB cap (see final handoff check below).
- `imd check`: exit 1, **unknown command: check**. The installed CLI is `0.1.0+fb8278c5`, whose help has no site/free-check action. The Foundry launch check is not applicable to profile `none`. No paid check or publication command was run.

Screenshots retained in `docs/review/`: Home at 390 and 1440, Swap at 390,
Staking full page at 390, Polygon wallet at 1440, and the focused skip link at 390.
They show the final export with reduced motion. Other viewport captures and
baseline scripts were local scratch evidence, not required runtime assets.

## Handoff limits

- Missing official asset URLs: **bmc.jpg — not supplied; BMC IMD.png — not supplied**.
- No public preview CID, ENS name, GitHub destination or pinning account was supplied.
  Source/export delivery and documented operator steps are complete; publishing and
  absolute social metadata must be completed by the publisher using real addresses.
- IMD free-check access is unavailable through the installed CLI. No check pass or
  payment readiness is claimed.
- PASS, staking, IMD and DEX integrations remain unset. No live transactions were
  exercised. No account/provider/device secrets were read or embedded.

### Final file inventory

Candidate source/export/docs inventory: 58 files, 2021389 bytes (1.928 MiB), below 8,388,608 bytes. This excludes worker inputs and disposable test/scratch evidence. No ignore files were changed, no dependency/cache directories or archives are included, and source/config/lockfile/export bytes match the isolated build tree. The worker commits the handoff; this revision did not modify Git administration files.

A direct Node test attempt in the dependency-free repository reported missing `viem`; dependencies intentionally live only in the isolated build copy. The documented installed-tree command `npm test --prefix /tmp/bmc-revision/web` passes all nine tests.
