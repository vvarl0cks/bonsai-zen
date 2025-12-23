import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract, useReadContracts } from 'wagmi';
import { Leaf, Search, TreeDeciduous, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TreeCard } from '@/components/TreeCard';
import { CONTRACT_ADDRESS, ABI } from '@/lib/contract';
import { parseTypeId, getSpecies, getRarity } from '@/lib/species';
import { 
  loadTrees, 
  saveTrees, 
  updateTree, 
  removeTree,
  canWater,
  canVitamin,
  type TreeState 
} from '@/lib/storage';

const Dashboard = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const [trees, setTrees] = useState<TreeState[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const { writeContract, isPending: isHarvesting } = useWriteContract();

  // Load trees from local storage
  useEffect(() => {
    if (address) {
      const savedTrees = loadTrees(address);
      setTrees(savedTrees);
    }
  }, [address]);

  // Generate contract calls for scanning wallet
  const scanCalls = address
    ? Array.from({ length: 100 }, (_, i) => ({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: ABI,
        functionName: 'balanceOf' as const,
        args: [address as `0x${string}`, BigInt(i)] as const,
      })) as any[]
    : [];

  const { refetch: refetchBalances } = useReadContracts({
    contracts: scanCalls,
    query: { enabled: false },
  });

  const handleScanWallet = useCallback(async () => {
    if (!address) return;
    
    setIsScanning(true);
    toast.info('Scanning wallet for seeds...');
    
    try {
      const result = await refetchBalances();
      
      if (result.data) {
        const existingTrees = loadTrees(address);
        const existingTypeIds = new Set(existingTrees.map(t => t.typeId));
        let newTreesCount = 0;
        
        result.data.forEach((balance, typeId) => {
          if (balance.result && BigInt(balance.result as bigint) > 0n && !existingTypeIds.has(typeId)) {
            existingTrees.push({
              typeId,
              progress: 0,
              lastWater: 0,
              lastVitamin: 0,
            });
            newTreesCount++;
          }
        });
        
        if (newTreesCount > 0) {
          saveTrees(address, existingTrees);
          setTrees(existingTrees);
          toast.success(`Found ${newTreesCount} new seed(s)!`);
        } else {
          toast.info('No new seeds found');
        }
      }
    } catch (error) {
      console.error('Scan error:', error);
      toast.error('Failed to scan wallet');
    } finally {
      setIsScanning(false);
    }
  }, [address, refetchBalances]);

  const handleWater = useCallback((typeId: number) => {
    if (!address) return;
    
    const tree = trees.find(t => t.typeId === typeId);
    if (!tree || !canWater(tree.lastWater)) return;
    
    const { speciesId } = parseTypeId(typeId);
    const species = getSpecies(speciesId);
    const progressGain = 5 * species.mult;
    const newProgress = Math.min(100, tree.progress + progressGain);
    
    const updatedTrees = updateTree(address, typeId, {
      progress: newProgress,
      lastWater: Date.now(),
    });
    
    setTrees(updatedTrees);
    toast.success(`💧 Watered! +${progressGain.toFixed(1)}%`);
  }, [address, trees]);

  const handleVitamin = useCallback((typeId: number) => {
    if (!address) return;
    
    const tree = trees.find(t => t.typeId === typeId);
    if (!tree || !canVitamin(tree.lastVitamin)) return;
    
    const { speciesId } = parseTypeId(typeId);
    const species = getSpecies(speciesId);
    const progressGain = 10 * species.mult;
    const newProgress = Math.min(100, tree.progress + progressGain);
    
    const updatedTrees = updateTree(address, typeId, {
      progress: newProgress,
      lastVitamin: Date.now(),
    });
    
    setTrees(updatedTrees);
    toast.success(`💊 Vitamins! +${progressGain.toFixed(1)}%`);
  }, [address, trees]);

  const handleHarvest = useCallback((typeId: number) => {
    if (!address) return;
    
    writeContract(
      {
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'harvest',
        args: [BigInt(typeId)],
      } as any,
      {
        onSuccess: () => {
          toast.success('🌳 Bonsai harvested! Check your wallet for the NFT.');
          const updatedTrees = removeTree(address, typeId);
          setTrees(updatedTrees);
        },
        onError: (error) => {
          console.error('Harvest error:', error);
          toast.error('Failed to harvest. Please try again.');
        },
      }
    );
  }, [address, writeContract]);

  if (!isConnected) {
    return (
      <div className="min-h-screen zen-gradient-bg flex items-center justify-center p-4">
        <motion.div
          className="zen-card p-8 max-w-md text-center space-y-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Leaf className="w-16 h-16 text-primary mx-auto" />
          <h1 className="font-serif text-3xl text-foreground">Connect to View Garden</h1>
          <p className="text-muted-foreground">
            Please connect your wallet to access your zen garden
          </p>
          <ConnectButton />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen zen-gradient-bg">
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-40 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between p-4 md:p-6">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-foreground hover:text-primary"
            onClick={() => navigate('/')}
          >
            <Leaf className="w-6 h-6" />
            <span className="font-serif text-lg">Bonsai Zen</span>
          </Button>
          <ConnectButton 
            showBalance={false}
            chainStatus="icon"
            accountStatus="avatar"
          />
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif zen-title mb-4">
              Your Zen Garden
            </h1>
            <p className="text-muted-foreground">
              Nurture your trees daily to grow beautiful bonsai NFTs
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="outline"
              className="border-2 border-primary/30 hover:border-primary hover:bg-primary/5"
              onClick={handleScanWallet}
              disabled={isScanning}
            >
              <Search className="w-4 h-4 mr-2" />
              {isScanning ? 'Scanning...' : '🔍 Scan Wallet'}
            </Button>
            <Button
              className="zen-button"
              onClick={() => navigate('/')}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Mint New Seed
            </Button>
          </motion.div>

          {/* Trees Grid */}
          {trees.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {trees.map((tree) => (
                  <TreeCard
                    key={tree.typeId}
                    tree={tree}
                    onWater={handleWater}
                    onVitamin={handleVitamin}
                    onHarvest={handleHarvest}
                    isHarvesting={isHarvesting}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              className="zen-card p-12 max-w-lg mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <TreeDeciduous className="w-20 h-20 text-primary/40 mx-auto mb-6" />
              <h2 className="font-serif text-2xl text-foreground mb-4">
                Your Garden is Empty
              </h2>
              <p className="text-muted-foreground mb-6">
                Plant your first seed to begin your bonsai journey. Each tree is unique!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  className="border-2 border-primary/30"
                  onClick={handleScanWallet}
                  disabled={isScanning}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Scan for Existing Seeds
                </Button>
                <Button
                  className="zen-button"
                  onClick={() => navigate('/')}
                >
                  🌱 Mint First Seed
                </Button>
              </div>
            </motion.div>
          )}
        </main>

        {/* Footer */}
        <footer className="text-center py-8 text-sm text-muted-foreground">
          <p>Water and vitamins reset every 24 hours</p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
