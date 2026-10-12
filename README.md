# BMC Illuminati

React 19 + TypeScript + Vite, with wagmi/viem for an injected browser wallet and
Ethereum Mainnet reads. The deployable static export is **`dist/` at the repository
root**, alongside its source and unchanged dependency lockfile in `web/`.

## Install, run and verify

Use Node 22.12+ and npm 10+. From the repository root:

```sh
cd web
npm ci
npm run dev
```

For a production export and local preview:

```sh
cd web
npm run typecheck
npm run build
npm test
npm run preview -- --host 127.0.0.1
```

`build` replaces `../dist/`. `preview` serves that export; Vite prints the local
URL. The site uses `#/pass`, `#/swap`, etc., and `base: './'`, so it needs no server
rewrites and works below an IPFS gateway subpath. Bundle JavaScript, CSS and images
are local. On-chain reads require an available public Ethereum RPC. There is no
backend or secret configuration in this static website. Install dependencies
from the lockfile; no vendored registry, dependency cache or `node_modules` belongs
in the submission. Building an installed dependency tree does not fetch assets.

Optional browser regression checks run against `dist/` and manage their own
server. Keep the browser tools outside the repository:

```sh
npm install --prefix /tmp/bmc-browser-tools --no-audit --no-fund playwright@1.64.0 @axe-core/playwright@4.13.0
/tmp/bmc-browser-tools/node_modules/.bin/playwright install chromium
PLAYWRIGHT_MODULE=/tmp/bmc-browser-tools/node_modules/playwright/index.mjs \
AXE_MODULE=/tmp/bmc-browser-tools/node_modules/@axe-core/playwright/dist/index.mjs \
node web/test/browser-check.mjs
```

Run that block from the repository root. `CHROMIUM_PATH` optionally selects an
already-installed Chromium executable; `BMC_CHECK_OUTPUT` selects the report and
screenshot directory (default `/tmp/bmc-browser-check`). Tests use a simulated
EIP-1193 wallet and intentionally unavailable RPC reads. They make no approvals,
signatures, swaps or other asset transactions.

## Configuration and future integrations

- `web/src/lib/wagmi.ts`: injected connector, chain ID **1**, and mainnet transport.
  Set `VITE_RPC_URL` in the build process environment to a **public, browser-safe**
  mainnet RPC if needed. Vite embeds it in the export; never use a provider key or
  authenticated RPC URL. The worker's loopback relay is not a public deployment
  endpoint and is not included in `dist/`.
- `web/src/config/contracts.ts`: existing BMC token
  `0x38224239f2BDae357D47cb864BC533d7f72dF961`; `INTEGRATIONS` slots for PASS,
  token/PASS/combined staking, IMD, and the DEX route remain `null`.
  They are configuration seams, not a verification service. **Setting an address
  alone does not implement an integration.** Add reviewed ABIs/read adapters,
  contract and funding verification, DEX quote/transaction handling, exact-amount
  approvals, and chain/error checks before enabling any financial action.
  Minting remains explicitly disabled. No new token, pool or contract is deployed.
- PASS development: `2aa0f8fa-379e-459b-a814-480f8c428c4f`; staking development:
  `fa117565-998a-4aaa-ad09-233e642d4c1e`. Their deployment/review/funding evidence
  has not been supplied to this revision.
- `web/src/config/brand.ts`: add the actual **`bmc.jpg`** and **`BMC IMD.png`** to
  `web/public/brand/`, then set `officialImages: true`. The pyramid URL is
  `./brand/BMC%20IMD.png`. The logo is wired into the header, Home and Dashboard
  token headings, and Staking heading. The pyramid is wired into the Home hero
  and a decorative ecosystem background. No official image or download URL was
  supplied for either file; do not mistake the labelled vector emblems for them.
- `web/src/pages/Community.tsx`: official Telegram/X URLs remain unset.
  `web/src/pages/Burns.tsx`: buyback history remains empty; add only confirmed
  purchase and burn records, with each transaction separately evidenced.

All unverified financial actions remain disabled. The revision preserves the
existing PASS schedule, staking weights and proposed allocation. The historical
Uniswap check displayed on Swap belongs to the earlier implementation; this
revision does not claim a new live liquidity audit.

## Publish to IPFS and eth.limo

**No public preview was published in this revision: publication is handed to the
network publisher, and no preview CID, owner ENS name or GitHub destination was
supplied.** The complete `dist/` is ready for that handoff. No CID, public URL or
GitHub repository is invented. An operator can publish manually as follows:

1. Build and check the export using the commands above.
2. With a running Kubo node, run from the repository root:
   `ipfs add -r --cid-version 1 dist`. Take the directory CID on the final `dist`
   line, and keep that content pinned and served. Alternatively upload the
   **contents** of `dist/` as a directory to an operator-owned pinning service;
   `index.html` must be at its root. Durable public availability requires an
   online IPFS node or a pinning service account. See the
   [IPFS hosting guide](https://docs.ipfs.tech/how-to/websites-on-ipfs/single-page-website/).
3. Open `https://<cid>.ipfs.dweb.link/` using the actual CIDv1. Check routes and
   relative assets. Record the resulting CID and preview URL here after publishing.
4. The owner of the ENS name sets its **contenthash** to `ipfs://<cid>` in the ENS
   app, confirming with their own wallet. The site then resolves at
   `https://<name>.eth.limo/` (where `<name>` omits `.eth`). This owner action is
   outside website creation; no owner wallet is accessed by this project. See
   [ENS website setup](https://support.ens.domains/en/articles/12275979-add-a-decentralised-website-to-your-ens-name).
5. Publish this source, `web/package-lock.json`, documentation and `dist/` to the
   owner's chosen GitHub repository using their normal reviewed workflow. No
   GitHub remote or account was provided for this task.

### Social image at publication

`web/public/og.svg` and `favicon.svg` are retained sources. Their raster exports
are `og.png` (1200×630) and `favicon-32.png` (32×32). Both ship locally. Open Graph
and Twitter metadata refer to the PNG; the favicon has a PNG fallback.

For reliable image unfurling, the publisher must provide an absolute public
image address at build time. Set **either** `VITE_SITE_URL` to the real stable
HTTPS site base (including any subpath), **or** `VITE_SHARE_IMAGE_URL` to an
already-published HTTPS PNG URL. For example, once the owner has set a shell
variable `PUBLIC_SITE_URL` to their actual eth.limo URL:

```sh
cd web
VITE_SITE_URL="$PUBLIC_SITE_URL" npm run build
npm test
```

Alternatively pin `og.png` separately first and use its public gateway URL as
`VITE_SHARE_IMAGE_URL`. Do not embed the enclosing site's own future CID: changing
HTML changes that CID. A stable ENS address or independently pinned image avoids
that circular dependency. Re-pin the rebuilt export and update contenthash.
Without either setting, this delivery uses `./og.png`; an absolute social preview
and crawler unfurling remain **unverified until publication**. The SVG/PNG emblem
is placeholder artwork, not either missing official brand image.

## Revision checks and limitations

Production build, typecheck, nine Node tests, responsive browser tests, wallet
network tests, and the six-domain Better Interface review are recorded in
[docs/validation.md](docs/validation.md). [DESIGN.md](DESIGN.md) describes the
implemented system. Dependencies were installed in an isolated `/tmp` copy of
`web/` from the unchanged lockfile, preserving the repository's protected paths;
the resulting export was copied back to `dist/`.

The requested **IMD free check could not run**: `imd check` returned
`unknown command: check` (exit 1) with installed CLI `0.1.0+fb8278c5`. The help lists
a Foundry launch check, but no static-site/free-check command; this task uses
profile `none`. No free-check pass, payment, independent certification or public
publication is claimed. Before payment/public launch, resolve the missing
images/URLs, publication destination, free-check access and any desired live
integrations with the requester/network operator.
