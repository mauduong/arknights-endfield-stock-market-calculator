import { type CSSProperties, type ReactNode } from "react";
import type { StockItem } from "../types";
import { Star } from "lucide-react";
import { getRegion, regionStyles, type Region } from "../data/regions";
import { colours } from "../theme";

interface StockCardProps {
  item: StockItem;
  updateItem: (
    id: string,
    field: keyof StockItem,
    value: StockItem[keyof StockItem]
  ) => void;
  calculatedProfit: number;
  isBest?: boolean;
  elasticIconSlug: string;
}

const colHeaderColors: Record<"Market" | "Player" | "Friend", string> = {
  Market: "text-blue-400",
  Player: "text-violet-400",
  Friend: "text-amber-400",
};

// Placeholder gradient background for elastic goods if images do not load properly
const placeholderElasticIconAccents: string[] = [
  "from-orange-500 to-amber-600",
  "from-violet-500 to-purple-600",
  "from-blue-500 to-indigo-600",
  "from-red-500 to-rose-600",
  "from-emerald-500 to-teal-600",
  "from-amber-400 to-yellow-500",
  "from-cyan-500 to-sky-600",
  "from-pink-500 to-fuchsia-600",
  "from-slate-500 to-gray-600",
  "from-sky-400 to-blue-500",
  "from-zinc-400 to-slate-500",
  "from-lime-500 to-green-500",
  "from-red-400 to-orange-500",
  "from-indigo-400 to-violet-500",
  "from-teal-500 to-emerald-600",
  "from-teal-400 to-cyan-500",
];

const StockCard = ({
  item,
  updateItem,
  calculatedProfit,
  isBest,
  elasticIconSlug,
}: StockCardProps) => {
  const accent: string =
    placeholderElasticIconAccents[
      parseInt(item.id) % placeholderElasticIconAccents.length
    ];

  const region: Region | undefined = getRegion(elasticIconSlug);
  const regionStyle: (typeof regionStyles)[Region] = region ? regionStyles[region] : regionStyles.valleyIV;

  // Only get the first two Initials, third letter is omitted for readability e.g Eureka Anti-smog Tincture = EA instead of EAT
  const elasticGoodsInitials: string = item.title
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  const handleChange = (field: keyof StockItem, value: string) => {
    if (value === "") {
      updateItem(item.id, field, "");
      return;
    }
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0 && num <= MAX_INPUT_VALUE) updateItem(item.id, field, num);
  };

  const profitColour =
    calculatedProfit > 0
      ? "text-emerald-400"
      : calculatedProfit < 0
        ? "text-red-400"
        : "text-slate-400";

  return (
    // Elastic Goods Card header w/ icon, best pick bool and profitability
    <div
      className={`bg-card-dark rounded-xl border overflow-hidden shadow-sm transition-all duration-200 ${
        isBest
          ? "animate-best-pick-glow"
          : "border-border-dark hover:border-border-hover-dark"
      }`}
      style={
        isBest
          ? ({
              borderColor: "transparent",
              "--glow-color": regionStyle.bestPick,
            } as CSSProperties)
          : {}
      }
    >
      <div
        className="flex items-center gap-3 px-4 border-b-7"
        style={{
          backgroundColor: colours.cardHeaderBg,
          borderBottomColor: isBest
            ? regionStyle.bestPick
            : colours.cardSeparator,
        }}
      >
        {/* Fallback initials if icon slugs do not load */}
        <img
          src={`${import.meta.env.BASE_URL}icons/${elasticIconSlug}.png`}
          alt={item.title}
          className="shrink-0 w-20 h-20 rounded-lg object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.nextElementSibling?.classList.remove("hidden");
          }}
        />
        <div
          className={`hidden shrink-0 w-20 h-20 rounded-lg bg-linear-to-br ${accent} flex items-center justify-center text-white font-bold text-xs shadow-sm select-none`}
        >
          {elasticGoodsInitials}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-white text-sm leading-tight truncate">
            {item.title}
          </h2>
          <span
            className={`inline-flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider ${isBest ? "visible" : "invisible"}`}
            style={{ color: regionStyle.bestPick }}
          >
            <Star size={9} fill="currentColor" />
            Best pick
          </span>
        </div>
        <div className="shrink-0 text-right min-w-20">
          <span className="block text-[9px] text-slate-300 uppercase tracking-widest font-semibold">
            Profit
          </span>
          <span
            className={`text-base font-mono font-bold leading-tight ${profitColour}`}
          >
            {calculatedProfit !== 0
              ? `${calculatedProfit > 0 ? "+" : ""}${Math.round(calculatedProfit).toLocaleString()}`
              : "-"}
          </span>
        </div>
      </div>

      {/* Elastic Goods Card Market, Player, Friend Columns */}
      <div className="grid grid-cols-3 divide-x divide-border-dark border-b border-border-dark bg-col-header-dark">
        {(["Market", "Player", "Friend"] as const).map((col) => (
          <div
            key={col}
            className="px-3 py-1.5 flex items-center justify-center"
          >
            <span
              className={`text-[9px] font-bold uppercase tracking-widest ${colHeaderColors[col]}`}
            >
              {col}
            </span>
          </div>
        ))}
      </div>

      {/* Subcolumns with fields */}
      <div className="grid grid-cols-3 divide-x divide-border-dark">
        <div className="p-3 space-y-2.5">
          <FieldRow label="Price">
            <CompactInput
              value={item.marketPrice}
              onChange={(v) => handleChange("marketPrice", v)}
            />
          </FieldRow>
          <FieldRow label="Market Qty">
            <CompactInput
              value={item.marketQuantity}
              onChange={(v) => handleChange("marketQuantity", v)}
              placeholder="0"
            />
          </FieldRow>
        </div>

        <div className="p-3 space-y-2.5">
          <FieldRow label="Price">
            <CompactInput
              value={item.playerPrice}
              onChange={(v) => handleChange("playerPrice", v)}
            />
          </FieldRow>
          <FieldRow label="Owned Qty">
            <CompactInput
              value={item.playerQuantity}
              onChange={(v) => handleChange("playerQuantity", v)}
              placeholder="0"
            />
          </FieldRow>
        </div>

        <div className="p-3 space-y-2.5">
          <FieldRow label="Price">
            <CompactInput
              value={item.friendPrice}
              onChange={(v) => handleChange("friendPrice", v)}
            />
          </FieldRow>
        </div>
      </div>
    </div>
  );
};

// Input Subcomponents
interface FieldRowProps {
  label: string;
  children: ReactNode;
}

const FieldRow = ({ label, children }: FieldRowProps) => (
  <div>
    <span className="block text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
      {label}
    </span>
    {children}
  </div>
);

interface CompactInputProps {
  value: number | "";
  onChange: (value: string) => void;
  step?: number;
  placeholder?: string;
}

const MAX_INPUT_VALUE = 9_999_999;

const blockNonInteger = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if ([".", ",", "-", "+", "e", "E"].includes(e.key)) e.preventDefault();
};

const blockNonIntegerPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
  const pasted = e.clipboardData.getData("text");
  if (!/^\d+$/.test(pasted)) e.preventDefault();
};

const CompactInput = ({
  value,
  onChange,
  step = 1,
  placeholder = "",
}: CompactInputProps) => (
  <input
    type="number"
    step={step}
    min="0"
    value={value}
    placeholder={placeholder}
    max={MAX_INPUT_VALUE}
    onChange={(e) => onChange(e.target.value)}
    onKeyDown={blockNonInteger}
    onPaste={blockNonIntegerPaste}
    className="w-full px-2 py-1 bg-input-dark border border-transparent focus:border-blue-500 focus:bg-input-focus-dark rounded text-xs font-mono outline-none transition-colors text-slate-100 placeholder:text-slate-500 text-center"
  />
);

export default StockCard;
