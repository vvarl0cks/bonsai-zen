import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Shuffle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { drawSeedPreview } from '@/lib/tree';
import { 
  SPECIES, 
  RARITIES, 
  RARITY_COLORS, 
  getWeightedRandomRarity, 
  getRandomSpecies, 
  getTypeId 
} from '@/lib/species';

interface MintPreviewProps {
  onMint: (typeId: number) => void;
  isMinting: boolean;
}

export function MintPreview({ onMint, isMinting }: MintPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [speciesId, setSpeciesId] = useState(0);
  const [rarityId, setRarityId] = useState(0);
  
  const species = SPECIES[speciesId];
  const rarity = RARITIES[rarityId];
  const rarityColor = RARITY_COLORS[rarity];
  
  // Animate seed preview
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let running = true;
    
    const animate = () => {
      if (!running) return;
      drawSeedPreview(ctx, species, Date.now());
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => { running = false; };
  }, [species]);

  const handleSurprise = useCallback(() => {
    const newSpeciesId = getRandomSpecies();
    const newRarityId = getWeightedRandomRarity();
    setSpeciesId(newSpeciesId);
    setRarityId(newRarityId);
  }, []);

  const handleMint = useCallback(() => {
    const typeId = getTypeId(speciesId, rarityId);
    onMint(typeId);
  }, [speciesId, rarityId, onMint]);

  return (
    <motion.div
      className="zen-card p-6 md:p-8 max-w-md mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="text-center space-y-6">
        {/* Seed Canvas */}
        <div className="relative mx-auto w-48 h-48 bg-gradient-to-b from-secondary/40 to-secondary/20 rounded-full overflow-hidden">
          <canvas
            ref={canvasRef}
            width={200}
            height={200}
            className="w-full h-full"
          />
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ 
              boxShadow: [
                `0 0 20px ${species.leafColor}40`,
                `0 0 40px ${species.leafColor}60`,
                `0 0 20px ${species.leafColor}40`
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        
        {/* Species Info */}
        <div className="space-y-2">
          <h3 className="font-serif text-2xl text-foreground">{species.name}</h3>
          <Badge
            className="text-sm font-semibold"
            style={{ 
              backgroundColor: rarityColor + '20', 
              color: rarityColor,
              borderColor: rarityColor + '40'
            }}
          >
            <Sparkles className="w-3 h-3 mr-1" />
            {rarity}
          </Badge>
          <p className="text-sm text-muted-foreground">{species.desc}</p>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="w-full py-6 text-lg border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all"
            onClick={handleSurprise}
          >
            <Shuffle className="w-5 h-5 mr-2" />
            🎲 Surprise Me
          </Button>
          
          <Button
            className="w-full zen-button py-6 text-lg"
            onClick={handleMint}
            disabled={isMinting}
          >
            {isMinting ? (
              <>
                <motion.div
                  className="w-5 h-5 mr-2 border-2 border-primary-foreground border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                Planting Seed...
              </>
            ) : (
              <>🌱 Mint Free Seed NFT</>
            )}
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Minting is free! Only pay gas on Base Sepolia testnet.
        </p>
      </div>
    </motion.div>
  );
}
