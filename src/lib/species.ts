export interface Species {
  id: number;
  name: string;
  leafColor: string;
  trunk: string;
  mult: number;
  desc: string;
}

export const SPECIES: readonly Species[] = [
  { id: 0, name: "Ficus (Ficus retusa)", leafColor: "#228B22", trunk: "#8B4513", mult: 1.0, desc: "Popular indoor evergreen with aerial roots." },
  { id: 1, name: "Juniper (Juniperus)", leafColor: "#2F4F2F", trunk: "#654321", mult: 1.1, desc: "Classic outdoor conifer." },
  { id: 2, name: "Japanese Maple (Acer palmatum)", leafColor: "#DC143C", trunk: "#A0522D", mult: 1.2, desc: "Colorful deciduous leaves." },
  { id: 3, name: "Chinese Elm (Ulmus parviflora)", leafColor: "#32CD32", trunk: "#D2691E", mult: 1.0, desc: "Hardy beginner tree." },
  { id: 4, name: "Azalea (Rhododendron)", leafColor: "#FF69B4", trunk: "#8B4513", mult: 1.4, desc: "Vibrant flowering evergreen." },
  { id: 5, name: "Pine (Pinus)", leafColor: "#006400", trunk: "#8B4513", mult: 1.3, desc: "Long-needle conifer." },
  { id: 6, name: "Jade (Crassula ovata)", leafColor: "#90EE90", trunk: "#BDB76B", mult: 0.9, desc: "Succulent indoor." },
  { id: 7, name: "Fukien Tea (Carmona)", leafColor: "#ADFF2F", trunk: "#696969", mult: 1.0, desc: "Small flowers indoor." },
  { id: 8, name: "Olive (Olea europaea)", leafColor: "#808000", trunk: "#D2691E", mult: 1.1, desc: "Silvery drought-tolerant." },
  { id: 9, name: "Trident Maple (Acer buergerianum)", leafColor: "#FF4500", trunk: "#CD853F", mult: 1.1, desc: "Three-lobed leaves." },
  { id: 10, name: "Cherry (Prunus)", leafColor: "#FFB6C1", trunk: "#654321", mult: 1.2, desc: "Spring blossoms." },
  { id: 11, name: "Ginkgo (Ginkgo biloba)", leafColor: "#FFD700", trunk: "#D2B48C", mult: 1.3, desc: "Fan-shaped leaves." },
  { id: 12, name: "Bald Cypress (Taxodium distichum)", leafColor: "#228B22", trunk: "#8B4513", mult: 1.2, desc: "Feathery fall color." },
  { id: 13, name: "Boxwood (Buxus)", leafColor: "#556B2F", trunk: "#DEB887", mult: 1.0, desc: "Dense small leaves." },
  { id: 14, name: "Wisteria (Wisteria)", leafColor: "#9370DB", trunk: "#654321", mult: 1.2, desc: "Cascading flowers." },
  { id: 15, name: "Oak (Quercus)", leafColor: "#228B22", trunk: "#A0522D", mult: 1.3, desc: "Lobed strong leaves." },
  { id: 16, name: "Spruce (Picea)", leafColor: "#4682B4", trunk: "#778899", mult: 1.2, desc: "Pyramidal conifer." },
  { id: 17, name: "Cotoneaster (Cotoneaster)", leafColor: "#DC143C", trunk: "#8B4513", mult: 1.0, desc: "Berries and dense." },
  { id: 18, name: "Hornbeam (Carpinus)", leafColor: "#32CD32", trunk: "#A0522D", mult: 1.1, desc: "Smooth bark fine leaves." },
  { id: 19, name: "Cedar (Cedrus)", leafColor: "#90EE90", trunk: "#8B4513", mult: 1.3, desc: "Aromatic needles." },
] as const;

export const RARITIES = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'] as const;
export type Rarity = typeof RARITIES[number];

export const RARITY_WEIGHTS = [70, 20, 7, 2, 1];

export const RARITY_COLORS: Record<Rarity, string> = {
  Common: '#9CA3AF',
  Uncommon: '#22C55E',
  Rare: '#3B82F6',
  Epic: '#A855F7',
  Legendary: '#EAB308',
};

export const RARITY_BG_CLASSES: Record<Rarity, string> = {
  Common: 'bg-rarity-common',
  Uncommon: 'bg-rarity-uncommon',
  Rare: 'bg-rarity-rare',
  Epic: 'bg-rarity-epic',
  Legendary: 'bg-rarity-legendary',
};

// TypeId = speciesId * 5 + rarityId (0-99 for seeds, +100 for bonsai)
export function getTypeId(speciesId: number, rarityId: number): number {
  return speciesId * 5 + rarityId;
}

export function parseTypeId(typeId: number): { speciesId: number; rarityId: number; isBonsai: boolean } {
  const isBonsai = typeId >= 100;
  const seedTypeId = isBonsai ? typeId - 100 : typeId;
  return {
    speciesId: Math.floor(seedTypeId / 5),
    rarityId: seedTypeId % 5,
    isBonsai,
  };
}

export function getSpecies(speciesId: number): Species {
  return SPECIES[speciesId] || SPECIES[0];
}

export function getRarity(rarityId: number): Rarity {
  return RARITIES[rarityId] || RARITIES[0];
}

export function getWeightedRandomRarity(): number {
  const totalWeight = RARITY_WEIGHTS.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < RARITY_WEIGHTS.length; i++) {
    random -= RARITY_WEIGHTS[i];
    if (random <= 0) {
      return i;
    }
  }
  
  return 0;
}

export function getRandomSpecies(): number {
  return Math.floor(Math.random() * SPECIES.length);
}
