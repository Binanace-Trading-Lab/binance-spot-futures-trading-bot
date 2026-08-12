<p align="center">
  <img src="docs/banner.jpg" alt="Bot de trading Spot y Futures de Binance" width="100%" />
</p>

# Bot de trading Spot y Futures de Binance

<p align="center">
  <strong>Opera los libros más profundos de Binance: rupturas con buffer, fades de funding abarrotado, costes con disciplina BNB y frenos duros de riesgo.</strong><br/>
  binance · BTC/USDT · spot + dual-book · CCXT en vivo · risk-gated · MIT
</p>

<p align="center">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" />
  <img alt="CCXT" src="https://img.shields.io/badge/Execution-CCXT-111111" />
  <img alt="Venue" src="https://img.shields.io/badge/Venue-Binance-F3BA2F" />
  <img alt="Risk" src="https://img.shields.io/badge/Risk%20guardian-always%20on-orange" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
</p>

<p align="center">
  Idiomas: [English](README.md) · [中文](README.zh.md) · [Deutsch](README.de.md) · **Español**
</p>

> **Palabras clave:** binance trading bot · binance futures bot · binance spot bot · BNB fee discount trading

Binance concentra la liquidez global de BTC/USDT. Este sistema está hecho para tomarse esa profundidad en serio: entrar solo cuando el precio sale de un rango definido, fade cuando el funding del perp está abarrotado, dimensionar como fracción del equity y rechazar la orden si la pérdida diaria, el drawdown o los caps ya están calientes. Los defaults son un escritorio de arranque — **el perfil atractivo de ROI / win rate / drawdown aparece cuando afinas buffer, umbral de funding, tamaño y múltiplos R a tu libro.**

La voz de producto completa, las fórmulas y los gráficos están en **[README.md](README.md)**.

---

## Para quién

- Traders activos que piensan en **entradas, salidas, comisiones y unidades de riesgo**.
- Mesas que quieren **spot de Binance y crowding USDT-M en un solo loop**: momentum de ruptura más overlay de funding.
- Operadores con **ruta live** (market CCXT, `--confirm-live`, API keys) y **kill switch más frenos en dólares** delante de cada intención.
- Quien va a editar `settings.json` — no una máquina de beneficios garantizados.

---

## Estrategia

Dos piernas, un camino de decisión. **El fade de funding gana los empates.**

**Ruptura.** Ventana rodante de mids (`breakoutLookback`, default 20). Long solo si el último print supera el high previo en `breakoutBufferPct` (default `0.15` = **0,15%**). Short bajo el low. El buffer filtra fakeouts.

**Fade de funding.** Funding extremadamente positivo → largos abarrotados → **vender**. Extremadamente negativo → **comprar**. Umbral `fundingFadeThreshold` (default `0.0008`). El fade **anula** la ruptura si ambas disparan.

**Tamaño.** \(N = E \times \texttt{riskPerTradePct}/100\) (default **0,5%** del equity). En $10k ≈ clip de $50. Más punch: subir `riskPerTradePct` **junto** con `maxPositionUsd` / `maxNotionalUsd`.

**Dual-book.** Tras el fill: qty spot más ~98% de noción perp opuesta para que el **delta neto sea visible**. No es una segunda orden live silenciosa.

**BNB.** `useBnbDiscount: true` marca taker efectivo ≈ **75%** de los bps base. Solo cuadra si la cuenta paga con BNB.

**Puerta de riesgo.** Pérdida diaria, drawdown, nocional, posición y kill switch deben pasar.

---

## Por qué el edge puede ser potente

En venues finos, 0,15% de buffer es un coin-flip contra el slippage. En BTC/USDT ese mismo buffer puede ser una ruptura real de rango con costes taker de unos bps.

Las rupturas puras se pican en rango. Los fades puros se aplastan en tendencia de un sentido. **Juntos**, el fade puede frenar una ruptura contra perps abarrotados, y la ruptura aún puede coger expansión cuando el funding está quieto.

Los mismos knobs destrozan un libro si aprietas el buffer en noticias y subes tamaño contra la tendencia. No hay beneficio garantizado.

---

## Regímenes

| Régimen | Cinta | Mesa |
|---|---|---|
| Majors a dos lados, horas líquidas | Libros reales, rangos que rompen | La pierna de ruptura puede pagar |
| Funding extremo, aún bilateral | Estiramiento y mean-reversion | El fade suele ser el mejor trade |
| Rango estrecho | Micro oscilaciones | Holds; buffer demasiado tenso = churn |
| Tendencia / squeeze | Funding alto y precio que sigue | Los fades sangran; freno de DD |
| Gap de noticias / caída | Prints discontinuos | Kill switch y caps |

---

## Matemáticas

$$
\text{long} \iff C_t > H_t(1+b),\quad b=\texttt{breakoutBufferPct}/100
$$

$$
\text{sell} \iff f_t \ge \theta,\qquad \text{buy} \iff f_t \le -\theta
$$

$$
N = E \times \frac{\texttt{riskPerTradePct}}{100}
$$

Win rate de equilibrio antes de fees a 2R/1R = **33%**. Las fees suben el suelo — por eso importan BNB y el buffer.

$$
EV_{\text{net}} = pW - (1-p)L - N(f_{\text{eff}}+s)
$$

$$
f_{\text{eff}} = f_{\text{taker}}\times(0{,}75\text{ si BNB})
$$

---

## Análisis estadístico

Depende de settings, régimen y habilidad de tuning. **Sin beneficio garantizado.** Bloques de escenario sobre un libro de $10.000.

### Escenario optimizado (ilustrativo)

Lookback `24`, buffer `0.18`, θ `0.0010`, risk `0.45%`, clip cerca de **$1.900**, TP/SL `2.2`/`1`, BNB on.

| Métrica | Valor |
|---|---:|
| Muestra | **96 trades** |
| Win rate | **54,4%** |
| Loss rate | **45,6%** |
| Avg win / loss | **$41,20 / $20,40** |
| Payoff | **2,02** |
| Expectativa / trade | **+$12,12** |
| PnL neto / ROI | **+$1.164 / +11,6%** |
| Profit factor | **2,41** |
| Max drawdown | **4,6%** |
| Return/risk | **~1,9** |
| Mejor / peor | **+$88 / −$34** |
| Racha win / loss | **8 / 4** |
| Mix | **~58% ruptura / 42% fade** |

### Contraste tipo default (ilustrativo)

Win rate 51,2% · Payoff 1,18 · EV ~+$3,40 · ROI ~+2,0% · PF 1,21 · Max DD 7,4%. Los defaults son la rampa, no el techo. El salto de profit factor sale de **buffer + θ + tamaño de clip**.

Gráficos y tabla de tuning: [README.md](README.md).

---

## Riesgo

| Freno | Default | Comportamiento |
|---|---:|---|
| `maxDailyLossUsd` | **250** | Halt si PnL diario ≤ −$250 |
| `maxDrawdownPct` | **8** | Halt al 8% del pico |
| `maxNotionalUsd` | **5000** | Bloquea sobre el cap |
| `maxPositionUsd` | **2500** | Bloquea un clip |
| `killSwitch` | **false** | `true` congela todo |
| Live | `--confirm-live` | No arranca live por accidente |
| Sandbox | `true` | Déjalo on hasta probar keys |

Desactiva withdrawals en las API keys. Nunca subas `.env`. Swap + apalancamiento = riesgo de liquidación.

---

## Inicio rápido

```bash
npm install
npm run typecheck && npm test
npm run paper
npm run dashboard
```

```bash
cp .env.example .env
# BINANCE_API_KEY + BINANCE_API_SECRET
npm run live -- --confirm-live
```

Node **20+**. Ejemplo afinado: `breakoutLookback` 24, `breakoutBufferPct` 0.18, `fundingFadeThreshold` 0.001, `riskPerTradePct` 0.45, `takeProfitR` 2.2, `useBnbDiscount` true.

---

## Límites

El trading cripto puede perder dinero. **Nada aquí garantiza beneficio.** Las cifras de escenario son ilustrativas. El tamaño en el motor es **% de equity**, no ATR. El dual-book es visibilidad de inventario; live envía market según `marketType` (de fábrica: spot). El flag BNB solo vale si la cuenta paga fees en BNB. Software que operas tú: no es un fondo ni asesoramiento financiero.

---

## Descárgalo. Afínalo. Encuentra tu mejor mesa.

```bash
npm install && npm test && npm run paper
```

**Licencia:** MIT — [LICENSE](LICENSE).
