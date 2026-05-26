import { regionColours } from "../theme";

export const regionSlugs = {
  valleyIV: new Set([
    "ankhorilling-kitchenware",
    "musbeast-scrimshaw-dangles",
    "witchcraft-mining-drill",
    "aggeloi-war-tins",
    "valley-hydroculture-fillets",
    "unity-syrup",
    "originium-saplings",
    "sesqamam-knucklebones",
    "astarron-crystals",
    "vigilant-pickaxes",
    "scrap-toy-blocks",
    "hard-noggin-helmets"
  ]),
  wuling: new Set([
    "aerial-receptionists",
    "xiran-hue-fireworks",
    "chubby-lung-tianshi",
    "nymphsprout",
    "xiranite-filter-cores",
    "qingbo-rafts",
    "wuling-frozen-pears",
    "wuxia-movies",
    "eureka-anti-smog-tincture"
  ]),
} as const satisfies Record<string, ReadonlySet<string>>;

export type Region = keyof typeof regionSlugs;

const slugToRegion = new Map<string, Region>(
  (Object.entries(regionSlugs) as [Region, ReadonlySet<string>][]).flatMap(
    ([region, slugs]) => [...slugs].map((slug) => [slug, region])
  )
);

export const getRegion = (slug: string): Region | undefined =>
  slugToRegion.get(slug);

export const regions = Object.keys(regionSlugs) as Region[];

export const regionStyles: Record<Region, { sectionLine: string; bestPick: string; label: string }> = {
  valleyIV: { sectionLine: regionColours.valleyIV, bestPick: regionColours.valleyIV, label: "Valley IV" },
  wuling: { sectionLine: regionColours.wuling, bestPick: regionColours.wuling, label: "Wuling" },
};
