import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Pill, TreeDeciduous, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTreeCanvas } from '@/hooks/useTreeCanvas';
import { drawBonsai } from '@/lib/tree';
import { parseTypeId, getSpecies, getRarity, RARITY_COLORS } from '@/lib/species';
import { canWater, canVitamin, getTimeUntilReady } from '@/lib/storage';
import type { TreeState } from '@/lib/storage';

interface TreeCardProps {
  tree: TreeState;
  onWater: (typeId: number) => void;
  onVitamin: (typeId: number) => void;
  onHarvest: (typeId: number) => void;
  isHarvesting?: boolean;
}

export function TreeCard({ tree, onWater, onVitamin, onHarvest, isHarvesting }: TreeCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const { speciesId, rarityId } = parseTypeId(tree.typeId);
  const species = getSpecies(speciesId);
  const rarity = getRarity(rarityId);
  const rarityColor = RARITY_COLORS[rarity];
  
  const waterReady = canWater(tree.lastWater);
  const vitaminReady = canVitamin(tree.lastVitamin);
  const canHarvestTree = tree.progress >= 100;

  // Animation loop for canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let running = true;
    
    const animate = () => {
      if (!running) return;
      drawBonsai(ctx, { species, progress: tree.progress }, Date.now(), isShaking);
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => { running = false; };
  }, [species, tree.progress, isShaking]);

  const handleAction = useCallback((action: () => void) => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
    action();
  }, []);

  const handleHarvest = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => {
      onHarvest(tree.typeId);
      setShowConfetti(false);
    }, 1500);
  }, [tree.typeId, onHarvest]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="zen-card overflow-hidden hover:shadow-zen transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif text-lg text-foreground">
              {species.name.split(' (')[0]}
            </CardTitle>
            <Badge
              variant="secondary"
              className="font-semibold text-xs"
              style={{ 
                backgroundColor: rarityColor + '20', 
                color: rarityColor,
                borderColor: rarityColor + '40'
              }}
            >
              {rarity}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{species.desc}</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Tree Canvas */}
          <div className="relative bg-gradient-to-b from-secondary/30 to-secondary/10 rounded-2xl overflow-hidden">
            <canvas
              ref={canvasRef}
              width={400}
              height={500}
              className="w-full h-auto"
            />
            
            {/* Confetti overlay */}
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    initial={{ 
                      x: 200 + (Math.random() - 0.5) * 100,
                      y: 250,
                      scale: 0,
                      rotate: 0
                    }}
                    animate={{ 
                      x: 200 + (Math.random() - 0.5) * 300,
                      y: -100,
                      scale: [0, 1, 0.5],
                      rotate: Math.random() * 720 - 360
                    }}
                    transition={{ 
                      duration: 1.5,
                      delay: Math.random() * 0.3,
                      ease: 'easeOut'
                    }}
                  >
                    <Sparkles 
                      className="w-6 h-6" 
                      style={{ color: ['#FFD700', '#FF69B4', '#00CED1', '#98FB98'][Math.floor(Math.random() * 4)] }}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Growth Progress</span>
              <span className="font-semibold text-primary">{Math.round(tree.progress)}%</span>
            </div>
            <Progress 
              value={tree.progress} 
              className="h-3 bg-secondary"
            />
          </div>
          
          {/* Actions */}
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={waterReady ? 'default' : 'secondary'}
                  size="sm"
                  className={`flex-1 ${waterReady ? 'zen-button' : 'opacity-60'}`}
                  onClick={() => waterReady && handleAction(() => onWater(tree.typeId))}
                  disabled={!waterReady || canHarvestTree}
                >
                  <Droplets className="w-4 h-4 mr-1" />
                  Water
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {waterReady ? 'Water now (+5%)' : `Next in ${getTimeUntilReady(tree.lastWater)}`}
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={vitaminReady ? 'default' : 'secondary'}
                  size="sm"
                  className={`flex-1 ${vitaminReady ? 'zen-button' : 'opacity-60'}`}
                  onClick={() => vitaminReady && handleAction(() => onVitamin(tree.typeId))}
                  disabled={!vitaminReady || canHarvestTree}
                >
                  <Pill className="w-4 h-4 mr-1" />
                  Vitamin
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {vitaminReady ? 'Feed vitamins (+10%)' : `Next in ${getTimeUntilReady(tree.lastVitamin)}`}
              </TooltipContent>
            </Tooltip>
          </div>
          
          {/* Harvest Button */}
          {canHarvestTree && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="pt-2"
            >
              <Button
                className="w-full zen-button text-lg py-6 animate-glow-pulse"
                onClick={handleHarvest}
                disabled={isHarvesting}
              >
                <TreeDeciduous className="w-5 h-5 mr-2" />
                {isHarvesting ? 'Harvesting...' : 'Harvest Bonsai NFT 🌳'}
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
