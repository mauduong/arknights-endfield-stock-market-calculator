# Arknights: Endfield — Elastic Goods Calculator

An unofficial fan tool to help you find the most profitable elastic goods to sell in the Arknights: Endfield stock market.

> **Disclaimer:** Arknights: Endfield is a trademark of Hypergryph. This tool is not affiliated with, endorsed by, or sponsored by Hypergryph in any way.

## Features

- Current 22 elastic goods tracked simultaneously as of Patch 1.2
- Market, Player, and Friend price columns per Elastic Good
- Best recommendation to sell highlighted after calculation for both Valley IV and Wuling
- All data persisted to `localStorage` just in case you hit F5 or your device crashes

## Stack

- **React 19**
- **TypeScript**
- **Vite 7**
- **Tailwind CSS**
- **pnpm**

## Local Development

Run the following commands:

```bash
git clone https://github.com/mauduong/arknights-endfield-stock-market-calculator.git
cd arknights-endfield-stock-market-calculator

pnpm install
pnpm build
pnpm dev
```

> **Node.js requirement:** Vite 7 requires Node.js ≥ 22. Use [nvm](https://github.com/nvm-sh/nvm) to switch versions if needed.

## Available Scripts

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `pnpm dev`     | Start local dev server with HMR      |
| `pnpm build`   | Type-check and build                 |
| `pnpm local`   | Runs build, followed by dev script   |
| `pnpm lint`    | Run ESLint across the project        |
| `pnpm preview` | Preview the production build locally |

## How the Profit Calculation Works

Elastic goods have a **base price of 2,000**. Values change in game daily and flucuates based on your friends list.

### Market and Friend comparison (no owned quantity set)

```
Profit = (Friend Price - Market Price) × Market Quantity
```

If Market Quantity is left blank, it defaults to **1** so you can still see whether a trade is profitable before committing to a quantity.

### Player Owned Quantity comparison

```
Profit = (Player Owned Price × Player Owned Quantity) - Friend Price
```

If a Player Owned Price is entered but the quantity is left empty, it will default to Market comparison until you enter the player quantity amount.

### Both Market and Player Owned quantities set

```
Profit = (Friend Price - Market Price) × Market Quantity + (Player Owned Price × Owned Quantity) - Friend Price
```

This will be the calculation set when all input fields are entered.

### No quantity set (estimate only)

If no quantities are entered, the tool shows a rough **per unit estimate**:

```
Profit = Friend Price - Market Price (or Player Owned Price if no market price but you will need to input Player Quantity)
```

No quantity set is good for quick checks.

### Total Gains

The footer shows your **Total Gains** which is the sum of every elastic good entered across both regions.

```
Total Gains += All individual elastic goods profits
```

A best pick / recommendation will be highlighted and shown in the footer based on whichever item has the highest positive profit based on what you have entered.

## Contributions

Contributions are welcomed!

Please either create a branch or raise an issue for any changes.

Elastic Good names may be incorrect at the time of Patch 1.1 information

### Actionable Contributions

There are currently some issues identified from original development. Feel free to contribute!

TODOs identified:

- Reorder Wuling Stock when fully released
- Ardelia image scaling can be improved when the screen width shrinks under 720p, most noticeable on mobile width dimensions
- Not recommended labels for when calculations are not worth it due to low profits even if it is a positive profit
- How to use tool tip top right. Screenshots ingame to show what values to take and plot in

## License

MIT © 2026 — see [LICENSE](./LICENSE) for details.
