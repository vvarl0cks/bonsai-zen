import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTreeCanvas } from '@/hooks/useTreeCanvas';
import type { Species } from '@/lib/species';

interface TreeCanvasProps {
  species: Species;
  progress: number;
  isSeed?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

export function TreeCanvas({
  species,
  progress,
  isSeed = false,
  width = 400,
  height = 500,
  className = '',
}: TreeCanvasProps) {
  const { canvasRef } = useTreeCanvas({ species, progress, isSeed });

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-auto"
        style={{ maxWidth: width }}
      />
    </motion.div>
  );
}
