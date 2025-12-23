import { useRef, useEffect, useCallback, useState } from 'react';
import { drawBonsai, drawSeedPreview } from '@/lib/tree';
import type { Species } from '@/lib/species';

interface UseTreeCanvasOptions {
  species: Species;
  progress: number;
  isSeed?: boolean;
}

export function useTreeCanvas({ species, progress, isSeed = false }: UseTreeCanvasOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isShaking, setIsShaking] = useState(false);

  const shake = useCallback(() => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    const animate = () => {
      if (!running) return;

      const time = Date.now();
      
      if (isSeed) {
        drawSeedPreview(ctx, species, time);
      } else {
        drawBonsai(ctx, { species, progress }, time, isShaking);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      running = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [species, progress, isSeed, isShaking]);

  return { canvasRef, shake };
}
