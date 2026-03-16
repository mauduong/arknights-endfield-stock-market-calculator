import { useState, useMemo, useEffect } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { StockItem } from "./types";
import StockCard from "./components/StockCard";
import { useDebounce } from "./hooks/useDebounce";
import { getRegion, regions, regionStyles, type Region } from "./data/regions";
import { elasticGoods } from "./data/elasticGoods";
import { colours } from "./theme";
import { calculateItemProfit, calculateTotalGains } from "./utils/profit";
import githubIcon from "./assets/github.svg";
import ardeliaPeek from "./assets/ardelia-peek.png";

const generateEmptyData = (): StockItem[] =>
  elasticGoods.map(({ title }, index) => ({
    id: index.toString(),
    title,
    marketPrice: "",
    marketQuantity: "",
    playerPrice: "",
    playerQuantity: 0,
    friendPrice: "",
  }));

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const [items, setItems] = useState<StockItem[]>(() => {
    const savedData = localStorage.getItem("endfield_stock_calculator_data");
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch {
        return generateEmptyData();
      }
    }
    return generateEmptyData();
  });

  useEffect(() => {
    localStorage.setItem(
      "endfield_stock_calculator_data",
      JSON.stringify(items)
    );
  }, [items]);

  const debouncedItems: StockItem[] = useDebounce(items, 1500);

  const updateItem = (
    id: string,
    field: keyof StockItem,
    value: StockItem[keyof StockItem]
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const totalGains: number = useMemo(
    () => calculateTotalGains(debouncedItems),
    [debouncedItems]
  );

  const regionTops = useMemo(
    () =>
      Object.fromEntries(
        regions.map((region) => {
          let maxProfit = 0;
          let best: StockItem | null = null;
          debouncedItems.forEach((item) => {
            if (getRegion(elasticGoods[parseInt(item.id)].slug) !== region)
              return;
            const profit = calculateItemProfit(item);
            if (profit > maxProfit) {
              maxProfit = profit;
              best = item;
            }
          });
          return [region, { bestElasticGood: best, maxProfit }];
        })
      ) as Record<
        Region,
        { bestElasticGood: StockItem | null; maxProfit: number }
      >,
    [debouncedItems]
  );

  const scrollToRegion = (region: Region) =>
    document
      .getElementById(`section-${region}`)
      ?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-page-dark pb-36 sm:pb-24">
      <title>Arknights Endfield Stock Market Calculator</title>
      <meta
        name="description"
        content="Calculate your Arknights: Endfield stock market profits. Compare elastic goods prices, friend prices, and optimise your trade profits daily."
      />
      <meta
        name="keywords"
        content="arknights endfield stock market calculator, elastic goods, endfield stock trade calculator"
      />

      <header
        className="border-b border-slate-700 text-white pt-4 pb-3 shadow-lg mb-8"
        style={{ backgroundColor: colours.darkBg }}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-lg font-bold tracking-widest uppercase text-slate-100">
            Arknights: Endfield Stock Market Calculator
          </h1>
          <p className="text-slate-400 text-xs mt-0.5 tracking-wider">
            A tool to help you find what elastic goods to sell daily on your
            second monitor
          </p>
        </div>
        <div className="container mx-auto px-4 max-w-7xl flex justify-between items-center mt-3 pt-3 border-t border-slate-700">
          {/* Anchor link buttons per region */}
          <div className="flex gap-2">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => scrollToRegion(region)}
                className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors cursor-pointer hover:brightness-125"
                style={{
                  color: regionStyles[region].sectionLine,
                  borderColor: `${regionStyles[region].sectionLine}55`,
                  backgroundColor: `${regionStyles[region].sectionLine}10`,
                }}
              >
                <ArrowDown size={14} />
                {regionStyles[region].label}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to clear all data?")) {
                setItems(generateEmptyData());
              }
            }}
            className="text-sm text-red-400 hover:text-red-200 font-medium px-3 py-1.5 border border-red-800/60 hover:border-red-600/80 hover:bg-red-900/40 rounded-lg transition-colors cursor-pointer"
          >
            Clear All Data
          </button>
        </div>
      </header>

      {/* Regions */}
      <main className="relative z-10 container mx-auto px-4 max-w-7xl pb-4">
        {regions.map((region, regionIndex) => {
          const style = regionStyles[region];
          const regionItems = items.filter(
            (item) => getRegion(elasticGoods[parseInt(item.id)].slug) === region
          );

          return (
            <section
              key={region}
              id={`section-${region}`}
              className={regionIndex > 0 ? "mt-10" : ""}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-5 h-px shrink-0"
                  style={{ backgroundColor: style.sectionLine }}
                />
                <span
                  className="text-lg font-bold uppercase tracking-[0.2em] shrink-0"
                  style={{ color: style.sectionLine }}
                >
                  {style.label}
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: style.sectionLine }}
                />
              </div>

              {/* Elastic Goods Cards per region */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {regionItems.map((item) => {
                  const debouncedItem =
                    debouncedItems.find((d) => d.id === item.id) || item;
                  const profit = calculateItemProfit(debouncedItem);
                  const isBest =
                    regionTops[region].bestElasticGood?.id === item.id &&
                    regionTops[region].maxProfit > 0;

                  return (
                    <StockCard
                      key={item.id}
                      item={item}
                      updateItem={updateItem}
                      calculatedProfit={profit}
                      isBest={isBest}
                      elasticIconSlug={elasticGoods[parseInt(item.id)].slug}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      {/* Ardelia peek bottom left */}
      <img
        src={ardeliaPeek}
        alt=""
        className="fixed bottom-15 left-0 z-0 w-[15vw] max-w-44 -rotate-8 object-contain pointer-events-none select-none"
        style={{ transformOrigin: "bottom left" }}
      />

      {/* Back to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-28 right-4 z-50 p-2.5 rounded-full border border-slate-600 text-slate-400 hover:text-white hover:border-slate-500 transition-colors cursor-pointer"
        style={{ backgroundColor: colours.darkBg }}
        aria-label="Back to top"
      >
        <ArrowUp size={16} />
      </button>

      {/* Fixed Footer */}
      <div
        className="fixed bottom-0 left-0 right-0 text-white border-t border-slate-700 py-3 px-4 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.4)] z-50"
        style={{ backgroundColor: colours.darkBg }}
      >
        <div className="container mx-auto max-w-7xl flex flex-wrap items-center gap-y-2">
          {/* Elastic Goods recommendation per region */}
          <div className="flex divide-x divide-slate-700">
            {regions.map((region, i) => {
              const style = regionStyles[region];
              const top = regionTops[region];
              return (
                <div key={region} className={i === 0 ? "pr-5" : "px-5"}>
                  <div
                    className="text-xs uppercase tracking-widest font-bold mb-0.5"
                    style={{ color: style.bestPick }}
                  >
                    ★ {style.label}
                  </div>
                  {top.bestElasticGood ? (
                    <div className="text-sm truncate">
                      <span className="font-semibold text-white">
                        {top.bestElasticGood.title}
                      </span>
                      <span className="text-slate-500 mx-1.5">—</span>
                      <span className="font-mono font-bold text-emerald-400">
                        +{Math.round(top.maxProfit).toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500 italic">
                      No data entered
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Spacer for total gains to wrap on smaller screen widths */}
          <div className="sm:flex-1" />

          <div className="w-full sm:w-auto border-t border-slate-700 pt-1.5 sm:border-t-0 sm:pt-0 sm:border-l sm:pl-6 flex items-center justify-between sm:block sm:text-right">
            <span className="block text-base text-slate-400 uppercase tracking-widest mb-0.5">
              Total Gains
            </span>
            <span
              className={`text-2xl leading-none font-mono font-bold ${totalGains >= 0 ? "text-emerald-400" : "text-red-400"}`}
            >
              {totalGains >= 0 ? "+" : ""}
              {Math.round(totalGains).toLocaleString()}
            </span>
            <a
              href="https://github.com/mauduong/arknights-endfield-stock-market-calculator"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center gap-1 text-xs text-white opacity-60 hover:opacity-100 transition-opacity sm:justify-end"
            >
              <img
                src={githubIcon}
                alt="GitHub Icon"
                width={11}
                height={11}
                className="invert"
              />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
