import type { Species } from './species';

interface TreeData {
  progress: number;
  species: Species;
  isSeed?: boolean;
}

export function drawBonsai(
  ctx: CanvasRenderingContext2D,
  tree: TreeData,
  time: number = Date.now(),
  shake: boolean = false
): void {
  const canvas = ctx.canvas;
  const width = canvas.width;
  const height = canvas.height;
  
  ctx.clearRect(0, 0, width, height);
  
  const p = Math.max(0.05, tree.progress / 100);
  const centerX = width / 2;
  const potY = height * 0.9;
  
  // Apply shake effect
  if (shake) {
    ctx.save();
    const shakeX = (Math.random() - 0.5) * 4;
    const shakeY = (Math.random() - 0.5) * 2;
    ctx.translate(shakeX, shakeY);
  }
  
  // Draw pot shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.beginPath();
  ctx.ellipse(centerX, potY + height * 0.05, width * 0.28, height * 0.02, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw pot
  const potWidth = width * 0.5;
  const potHeight = height * 0.1;
  const potTopY = potY - potHeight;
  
  // Pot gradient
  const potGradient = ctx.createLinearGradient(centerX - potWidth / 2, potTopY, centerX + potWidth / 2, potTopY);
  potGradient.addColorStop(0, '#6B4423');
  potGradient.addColorStop(0.3, '#8B5A2B');
  potGradient.addColorStop(0.7, '#8B5A2B');
  potGradient.addColorStop(1, '#5D3A1A');
  
  ctx.fillStyle = potGradient;
  ctx.beginPath();
  ctx.moveTo(centerX - potWidth * 0.4, potTopY);
  ctx.lineTo(centerX - potWidth * 0.5, potY);
  ctx.lineTo(centerX + potWidth * 0.5, potY);
  ctx.lineTo(centerX + potWidth * 0.4, potTopY);
  ctx.closePath();
  ctx.fill();
  
  // Pot rim
  ctx.fillStyle = '#5D3A1A';
  ctx.fillRect(centerX - potWidth * 0.45, potTopY - height * 0.015, potWidth * 0.9, height * 0.02);
  
  // Soil
  ctx.fillStyle = '#3D2914';
  ctx.beginPath();
  ctx.ellipse(centerX, potTopY, potWidth * 0.38, height * 0.02, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Moss on soil
  if (p > 0.1) {
    ctx.fillStyle = '#4A7C23';
    for (let i = 0; i < 8; i++) {
      const mx = centerX + (Math.random() - 0.5) * potWidth * 0.6;
      const my = potTopY + (Math.random() - 0.5) * height * 0.015;
      ctx.beginPath();
      ctx.arc(mx, my, 3 + Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Calculate trunk properties
  const trunkHeight = height * 0.5 * p;
  const trunkWidth = 15 * p + 5;
  const trunkStartY = potTopY - height * 0.02;
  
  // Draw trunk with bezier curves
  ctx.strokeStyle = tree.species.trunk;
  ctx.lineWidth = trunkWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  // Main trunk
  const sway = Math.sin(time / 2000) * 3 * p;
  ctx.beginPath();
  ctx.moveTo(centerX, trunkStartY);
  ctx.bezierCurveTo(
    centerX + sway + 5, trunkStartY - trunkHeight * 0.3,
    centerX - sway - 5, trunkStartY - trunkHeight * 0.6,
    centerX + sway, trunkStartY - trunkHeight
  );
  ctx.stroke();
  
  // Draw branches recursively
  const branchSeed = tree.species.id * 1000;
  
  function seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }
  
  function drawBranch(
    x: number,
    y: number,
    length: number,
    angle: number,
    depth: number,
    seed: number
  ): void {
    if (depth > 7 * p || length < 3) return;
    
    const endX = x + Math.cos(angle) * length * p;
    const endY = y + Math.sin(angle) * length * p;
    
    // Branch line
    ctx.strokeStyle = tree.species.trunk;
    ctx.lineWidth = Math.max(1, (12 - depth * 1.5) * p);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    
    // Draw leaves at end of branches
    if (p > 0.2 && depth > 2) {
      const leafCount = Math.floor(p * 4) + 2;
      const leafSize = (6 + (1 - depth / 7) * 4) * p;
      
      for (let i = 0; i < leafCount; i++) {
        const leafAngle = seededRandom(seed + i * 100) * Math.PI * 2;
        const leafDist = seededRandom(seed + i * 200) * 15 * p;
        const lx = endX + Math.cos(leafAngle) * leafDist;
        const ly = endY + Math.sin(leafAngle) * leafDist;
        
        // Leaf glow
        const leafGlow = ctx.createRadialGradient(lx, ly, 0, lx, ly, leafSize * 1.5);
        leafGlow.addColorStop(0, tree.species.leafColor);
        leafGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = leafGlow;
        ctx.beginPath();
        ctx.arc(lx, ly, leafSize * 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Solid leaf
        ctx.fillStyle = tree.species.leafColor;
        ctx.beginPath();
        ctx.arc(lx, ly, leafSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Recurse for sub-branches
    const r1 = seededRandom(seed + depth * 17);
    const r2 = seededRandom(seed + depth * 23);
    
    drawBranch(
      endX,
      endY,
      length * 0.7,
      angle + (r1 - 0.5) * 0.8 - 0.1,
      depth + 1,
      seed + 1
    );
    
    if (depth < 4 * p) {
      drawBranch(
        endX,
        endY,
        length * 0.6,
        angle - (r2 - 0.5) * 0.6 + 0.1,
        depth + 1,
        seed + 2
      );
    }
  }
  
  // Start branches from trunk
  const branchStartY = trunkStartY - trunkHeight * 0.3;
  
  // Left branches
  drawBranch(
    centerX - trunkWidth * 0.3,
    branchStartY,
    40 * p,
    -Math.PI * 0.6 + Math.sin(time / 3000) * 0.05,
    1,
    branchSeed
  );
  
  // Right branches
  drawBranch(
    centerX + trunkWidth * 0.3,
    branchStartY - trunkHeight * 0.2,
    35 * p,
    -Math.PI * 0.4 + Math.sin(time / 2500) * 0.05,
    1,
    branchSeed + 100
  );
  
  // Top branches
  drawBranch(
    centerX + sway,
    trunkStartY - trunkHeight,
    45 * p,
    -Math.PI * 0.5 + Math.sin(time / 2000) * 0.08,
    1,
    branchSeed + 200
  );
  
  if (shake) {
    ctx.restore();
  }
}

export function drawSeedPreview(
  ctx: CanvasRenderingContext2D,
  species: Species,
  time: number = Date.now()
): void {
  const canvas = ctx.canvas;
  const width = canvas.width;
  const height = canvas.height;
  
  ctx.clearRect(0, 0, width, height);
  
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Floating animation
  const floatY = Math.sin(time / 1000) * 5;
  const rotation = Math.sin(time / 2000) * 0.1;
  
  ctx.save();
  ctx.translate(centerX, centerY + floatY);
  ctx.rotate(rotation);
  
  // Seed glow
  const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 50);
  glowGradient.addColorStop(0, species.leafColor + '40');
  glowGradient.addColorStop(1, 'transparent');
  ctx.fillStyle = glowGradient;
  ctx.beginPath();
  ctx.arc(0, 0, 50, 0, Math.PI * 2);
  ctx.fill();
  
  // Seed body
  const seedGradient = ctx.createRadialGradient(-5, -5, 0, 0, 0, 25);
  seedGradient.addColorStop(0, species.trunk);
  seedGradient.addColorStop(0.7, '#5D3A1A');
  seedGradient.addColorStop(1, '#3D2914');
  
  ctx.fillStyle = seedGradient;
  ctx.beginPath();
  ctx.ellipse(0, 0, 20, 28, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Seed highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.beginPath();
  ctx.ellipse(-5, -8, 6, 10, -0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // Small sprout
  ctx.strokeStyle = species.leafColor;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, -28);
  ctx.bezierCurveTo(2, -35, -2, -42, 0, -48);
  ctx.stroke();
  
  // Tiny leaf
  ctx.fillStyle = species.leafColor;
  ctx.beginPath();
  ctx.ellipse(4, -40, 5, 3, 0.5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}
