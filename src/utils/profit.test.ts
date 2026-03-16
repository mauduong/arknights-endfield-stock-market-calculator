import { describe, it, expect } from "vitest";
import { calculateItemProfit, calculateTotalGains } from "./profit";
import type { StockItem } from "../types";

// Dummy data initiation
function item(overrides: Partial<StockItem> = {}): StockItem {
  return {
    id: "0",
    title: "Yvonne's Apricot",
    marketPrice: "",
    marketQuantity: "",
    playerPrice: "",
    playerQuantity: 0,
    friendPrice: "",
    ...overrides,
  };
}

describe("CalculateItemProfit with no friend price set", () => {
  it("Return 0 when friend price is empty", () => {
    expect(calculateItemProfit(item({ marketPrice: 1000, friendPrice: "" }))).toBe(0);
  });

  it("Return 0 when friend price is set to 0", () => {
    expect(calculateItemProfit(item({ marketPrice: 1000, friendPrice: 0 }))).toBe(0);
  });
});

describe("Vs Local market quantity calculation checks with no player owned quantity", () => {
  it("Calculates positive profit with market price and quantity", () => {
    // Friend @ 3000, market @ 2000, 5 quantity
    expect(
      calculateItemProfit(item({ marketPrice: 2000, marketQuantity: 5, friendPrice: 3000 }))
    ).toBe(5000); // (3000 - 2000) * 5
  });

  it("Calculates negative profit when market price is above friend buying price", () => {
    // Friend @ 1500, market @ 2000, 3 quantity
    expect(
      calculateItemProfit(item({ marketPrice: 2000, marketQuantity: 3, friendPrice: 1500 }))
    ).toBe(-1500); // (1500 - 2000) * 3
  });

  it("Return 0 profit when friend price equals market price / base price", () => {
    expect(
      calculateItemProfit(item({ marketPrice: 2000, marketQuantity: 10, friendPrice: 2000 }))
    ).toBe(0);
  });

  it("Calculate profit with large market quantity (not actually realistic or possible in game)", () => {
    expect(
      calculateItemProfit(item({ marketPrice: 1500, marketQuantity: 99999, friendPrice: 2000 }))
    ).toBe(49999500); // (2000 - 1500) * 99999
  });

  it("Calculate positive profit when market quantity is left as default / 0", () => {
    expect(
      calculateItemProfit(item({ marketPrice: 1000, marketQuantity: 0, friendPrice: 2000 }))
    ).toBe(1000);
  });

  it("Calculate negative profit when market quantity is left as default", () => {
    expect(
      calculateItemProfit(item({ marketPrice: 2000, marketQuantity: 0, friendPrice: 1000 }))
    ).toBe(-1000);
  });
});

describe("Vs Owned with player quantity calculations", () => {
  it("Calculates positive profit with player price and quantity", () => {
    expect(
      calculateItemProfit(item({ playerPrice: 690, playerQuantity: 500, friendPrice: 4200 }))
    ).toBe(340800);
  });

  it("Calculates profit when friend price is below player price", () => {
    expect(
      calculateItemProfit(item({ playerPrice: 3000, playerQuantity: 50, friendPrice: 2000 }))
    ).toBe(148000);
  });

  it("Calculate positive profit when friend price equals player price but there is player quantity", () => {
    expect(
      calculateItemProfit(item({ playerPrice: 2500, playerQuantity: 8, friendPrice: 2500 }))
    ).toBe(17500);
  });

  it("Return 0 because player quantity isn't set and no market price and market quantity has been entered", () => {
    expect(
      calculateItemProfit(item({ playerPrice: 100, playerQuantity: 0, friendPrice: 3000 }))
    ).toBe(0);
  });
});

describe("Combined market and player quantity calculations", () => {
  it("Sums market and player profits when both are present", () => {
    // Market: (3000 - 2000) * 5 = 5000
    // Owned:  1000 * 10 - 3000 = 7000
    expect(
      calculateItemProfit(
        item({
          marketPrice: 2000,
          marketQuantity: 5,
          playerPrice: 1000,
          playerQuantity: 10,
          friendPrice: 3000,
        })
      )
    ).toBe(12000);
  });

  it("Sums market and player profits when player price exceeds friend price", () => {
    // Market: (1500 - 1000) * 2 = 1000
    // Owned:  3000 * 10 - 1500 = 28500
    expect(
      calculateItemProfit(
        item({
          marketPrice: 1000,
          marketQuantity: 2,
          playerPrice: 3000,
          playerQuantity: 10,
          friendPrice: 1500,
        })
      )
    ).toBe(29500);
  });

  it("Calculate positive profit with mixed values where market is negative and player is positive", () => {
    // Market: (1000 - 2000) * 3 = -3000
    // Owned:  500 * 20 - 1000 = 9000
    expect(
      calculateItemProfit(
        item({
          marketPrice: 2000,
          marketQuantity: 3,
          playerPrice: 500,
          playerQuantity: 20,
          friendPrice: 1000,
        })
      )
    ).toBe(6000);
  });
});

describe("Default profit calculations", () => {
  it("Calculate a profit with default market price", () => {
    expect(
      calculateItemProfit(item({ marketPrice: 1800, friendPrice: 2200 }))
    ).toBe(400);
  });

  it("Return 0 with an empty marketPrice regardless of playerPrice entered", () => {
    expect(
      calculateItemProfit(item({ playerPrice: 1500, friendPrice: 2000 }))
    ).toBe(0);
  });

  it("Calculate using marketPrice instead of combining with playerPrice due to no quantity entered for both market and player", () => {
    expect(
      calculateItemProfit(item({ marketPrice: 1000, playerPrice: 500, friendPrice: 1800 }))
    ).toBe(800); // 1800 - 1000
  });

  it("Return 0 when neither market nor player price is present", () => {
    expect(calculateItemProfit(item({ friendPrice: 2000 }))).toBe(0);
  });
});

describe("Calculating profit with empty strings", () => {
  it("Empty string treated as 0 for marketPrice", () => {
    expect(
      calculateItemProfit(item({ marketPrice: "", marketQuantity: 5, friendPrice: 1000 }))
    ).toBe(0);
  });

  it("Empty string treated as 0 for marketQuantity", () => {
    expect(
      calculateItemProfit(item({ marketPrice: 1000, marketQuantity: "", friendPrice: 1500 }))
    ).toBe(500);
  });

  it("Empty string treated as 0 for friendPrice", () => {
    expect(
      calculateItemProfit(item({ marketPrice: 1000, marketQuantity: 5, friendPrice: "" }))
    ).toBe(0);
  });
});


describe("Clearing data tests", () => {
  it("Return 0 for a fully empty item (no inputs at all)", () => {
    expect(calculateItemProfit(item())).toBe(0);
  });

  it("Return 0 for each item when all data is cleared", () => {
    const clearedItems: StockItem[] = Array.from({ length: 16 }, (_, i) => ({
      id: i.toString(),
      title: `Some sort of item ${i}`,
      marketPrice: "",
      marketQuantity: "",
      playerPrice: "",
      playerQuantity: 0,
      friendPrice: "",
    }));
    clearedItems.forEach((it) => {
      expect(calculateItemProfit(it)).toBe(0);
    });
  });
});

describe("Total Gains calculateTotalGains", () => {
  it("Return 0 when all items are empty", () => {
    const empty: StockItem[] = Array.from({ length: 16 }, (_, i) =>
      item({ id: i.toString() })
    );
    expect(calculateTotalGains(empty)).toBe(0);
  });

  it("Sum all profits inputted", () => {
    const items: StockItem[] = [
      item({ id: "0", marketPrice: 1000, marketQuantity: 5, friendPrice: 2000 }), // +5000
      item({ id: "1", marketPrice: 2000, marketQuantity: 3, friendPrice: 1500 }), // -1500
      item({ id: "2", playerPrice: 500, playerQuantity: 10, friendPrice: 1000 }), // 500*10-1000 = +4000
    ];
    expect(calculateTotalGains(items)).toBe(7500); // 5000 - 1500 + 4000
  });

  it("Return a negative total when losses outweigh gains", () => {
    const items: StockItem[] = [
      item({ id: "0", marketPrice: 3000, marketQuantity: 10, friendPrice: 1000 }), // -20000
      item({ id: "1", marketPrice: 1000, marketQuantity: 2, friendPrice: 1200 }), // +400
    ];
    expect(calculateTotalGains(items)).toBe(-19600);
  });

  it("Return 0 for an empty item array", () => {
    expect(calculateTotalGains([])).toBe(0);
  });

  it("Calculates a single elastic good correctly", () => {
    // 1016 * 100 - 4049 = 97551
    const items: StockItem[] = [
      item({ id: "0", playerPrice: 1016, playerQuantity: 100, friendPrice: 4049 }),
    ];
    expect(calculateTotalGains(items)).toBe(97551);
  });

  it("Calculates the sum of all elastic goods", () => {
    // 16 items, each contributing 1000 profit
    const items: StockItem[] = Array.from({ length: 16 }, (_, i) =>
      item({ id: i.toString(), marketPrice: 1000, marketQuantity: 1, friendPrice: 2000 })
    );
    expect(calculateTotalGains(items)).toBe(16000);
  });
});
