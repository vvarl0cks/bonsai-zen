export interface TreeState {
  typeId: number;
  progress: number;
  lastWater: number;
  lastVitamin: number;
}

const STORAGE_PREFIX = 'bonsai-zen';

export function getStorageKey(address: string): string {
  return `${STORAGE_PREFIX}:${address.toLowerCase()}`;
}

export function loadTrees(address: string): TreeState[] {
  if (!address) return [];
  
  try {
    const key = getStorageKey(address);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTrees(address: string, trees: TreeState[]): void {
  if (!address) return;
  
  try {
    const key = getStorageKey(address);
    localStorage.setItem(key, JSON.stringify(trees));
  } catch (error) {
    console.error('Failed to save trees:', error);
  }
}

export function addTree(address: string, typeId: number): TreeState[] {
  const trees = loadTrees(address);
  
  // Check if tree already exists
  const exists = trees.some(t => t.typeId === typeId);
  if (exists) return trees;
  
  const newTree: TreeState = {
    typeId,
    progress: 0,
    lastWater: 0,
    lastVitamin: 0,
  };
  
  const updatedTrees = [...trees, newTree];
  saveTrees(address, updatedTrees);
  return updatedTrees;
}

export function updateTree(address: string, typeId: number, updates: Partial<TreeState>): TreeState[] {
  const trees = loadTrees(address);
  const updatedTrees = trees.map(tree =>
    tree.typeId === typeId ? { ...tree, ...updates } : tree
  );
  saveTrees(address, updatedTrees);
  return updatedTrees;
}

export function removeTree(address: string, typeId: number): TreeState[] {
  const trees = loadTrees(address);
  const updatedTrees = trees.filter(t => t.typeId !== typeId);
  saveTrees(address, updatedTrees);
  return updatedTrees;
}

const COOLDOWN_HOURS = 24;
const COOLDOWN_MS = COOLDOWN_HOURS * 60 * 60 * 1000;

export function canWater(lastWater: number): boolean {
  return Date.now() - lastWater >= COOLDOWN_MS;
}

export function canVitamin(lastVitamin: number): boolean {
  return Date.now() - lastVitamin >= COOLDOWN_MS;
}

export function getTimeUntilReady(lastAction: number): string {
  const remaining = COOLDOWN_MS - (Date.now() - lastAction);
  if (remaining <= 0) return 'Ready!';
  
  const hours = Math.floor(remaining / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
