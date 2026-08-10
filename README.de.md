<p align="center">
  <img src="docs/banner.jpg" alt="Binance Spot & Futures Trading Bot" width="100%" />
</p>

# Binance Spot & Futures Trading Bot

<p align="center">
  <strong>Deepest books on earth — spot + USDT-M with BNB fee discipline</strong><br/>
  binance · paper + live · risk-gated · MIT
</p>

<p align="center">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" />
  <img alt="CCXT" src="https://img.shields.io/badge/Execution-CCXT-111111" />
  <img alt="Modes" src="https://img.shields.io/badge/Paper%20%2B%20Live-ready-success" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
</p>

<p align="center">
  Sprachen: [English](README.md) · [中文](README.zh.md) · **Deutsch** · [Español](README.es.md)
</p>

> **Suchbegriffe:** binance trading bot · binance futures bot · binance spot bot · BNB fee discount trading

---

## Performance-Snapshot

Demo-Analytics aus dem statischen Dashboard (`npm run dashboard`). Banner und Strategie-Diagramme bleiben erhalten.

<p align="center">
  <img src="docs/dashboard.jpg" alt="Binance DualDesk — Performance-Dashboard" width="100%" />
</p>

<p align="center">
  <img src="docs/pnl.jpg" alt="Binance DualDesk — PnL- / Equity-Ansicht" width="100%" />
</p>

<p align="center">
  <img src="docs/analytics.jpg" alt="Binance DualDesk — Analytics-Streifen" width="100%" />
</p>

---

## Projekt-Workflow

Klonen → konfigurieren → Paper → Credentials → Live. Risk immer an.

```mermaid
flowchart LR
  A[Repo klonen] --> B[npm install]
  B --> C[settings.json]
  C --> D[typecheck + test]
  D --> E[npm run paper]
  E --> F{Paper OK?}
  F -->|Ja| G[.env füllen]
  F -->|Tunen| C
  G --> H[npm run live --confirm-live]
  H --> I[Monitor / Risk]
  I -->|Limit| J[Halt]
```

| | |
|--|--|
| `npm run paper` | Zuerst Paper — keine API-Keys |
| `npm run dashboard` | Lokales Analytics-Dashboard öffnen (statisch) |
| `npm run live` | Benötigt `--confirm-live` + API-Credentials |

---

## Platform-Fit

| | |
|--|--|
| Venue | binance |
| Märkte | both |
| Edge | Deepest books on earth — spot + USDT-M with BNB fee discipline |
| Execution | CCXT Live (Sandbox) + Paper |

---

## Handelsstrategie

Binance bietet die tiefste globale Spot- und USDT-M-Liquidität. Der Bot nutzt diese Tiefe: **Breakout-Momentum** plus **Funding-Crowding-Fade**, mit **BNB-Fee-Awareness**, damit Kosten den Edge nicht auffressen. Spot-/Hedge-Buchhaltung macht Netto-Delta vor dem Risk-Gate sichtbar.

### So funktioniert es
- **Breakout** — Rolling Lookback; Entry nur mit Buffer außerhalb der Range.
- **Funding-Fade** — Extremes Funding als Crowding-Signal fadern.
- **Priorität** — Extreme Fades überschreiben Breakouts.
- **Sizing** — Festes Equity-% (`riskPerTradePct`); BNB-Discount senkt effektive Fees.
- **Dual Book** — Spot-Fills mit nahezu offsettendem Perp-Notional im internen Book.
- **Risk Gate** — Tagesverlust, Drawdown, Notional-/Positions-Caps, Kill-Switch.

### Wann der Edge erscheint
**Bestes Regime:** liquide Majors, zweiseitiger Flow, gelegentliche Funding-Extreme.

### Wann es scheitert
**Scheitert bei:** One-Way-Trends, persistentem Funding ohne Reversion, zu engem Buffer (Fee-Churn).

### Schlüsselparameter (`settings.json`)
- `breakoutLookback` / `breakoutBufferPct`
- `fundingFadeThreshold`
- `riskPerTradePct` / R-Multiples
- `useBnbDiscount`
- `risk.*`

### Strategiespezifische Risiken
- Perps bergen Liquidationsrisiko.
- Paper ≡ Live-Entscheidungspfad.
- Zuerst Sandbox / winzige Size.


---

## Strategie-Diagramm

```mermaid
flowchart TD
  A[Binance Spot+Perp Ticker] --> B[Breakout]
  A --> C[Funding-Fade]
  B --> D[Setups]
  C --> D
  D --> E[BNB Fee Size]
  E --> F[Risk]
  F -->|OK| G[Paper / CCXT]
  F -->|Block| H[Hold]
```

---

## Architektur

```
src/
  config/     Zod settings + env loader
  strategy/   venue-specific engine
  broker/     paper + CCXT live adapters
  risk/       daily loss / drawdown / caps
  app/        runtime loop
  fees/
  books/
  signals/
```

---

## Schnellstart

```bash
cd binance-spot-futures-trading-bot
npm install
npm run typecheck
npm test
npm run paper
```

### Live

```bash
cp .env.example .env
# set BINANCE_API_KEY + BINANCE_API_SECRET
# optional BINANCE_PASSWORD / PASSPHRASE
npm run live
```

---

## Konfiguration

`settings.json` — strategy + risk + paper/live flags.  
`.env` — secrets only (see `.env.example`).

---

## Risiko & Sicherheit

- Live refuses without `--confirm-live` and API credentials
- Prefer `live.sandbox: true` until proven
- Disable withdrawals on exchange API keys
- Daily loss / drawdown / notional caps + kill switch

---

## Haftungsausschluss

MIT-Bildungssoftware — **keine Finanzberatung**. CEX-Trading kann Totalverlust bedeuten.

## Lizenz

MIT — siehe [LICENSE](LICENSE).
