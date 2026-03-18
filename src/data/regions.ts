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
    "hard-noggin-helmets",
    "scrap-toy-blocks",
  ]),
  wuling: new Set([
    "chubby-lung-tianshi",
    "wuxia-movies",
    "wuling-frozen-pears",
    "eureka-anti-smog-tincture",
    "nymphsprout",
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
