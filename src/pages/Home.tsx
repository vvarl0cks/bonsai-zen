import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { Leaf, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MintPreview } from '@/components/MintPreview';
import { CONTRACT_ADDRESS, ABI } from '@/lib/contract';
import { addTree } from '@/lib/storage';

const Home = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  
  const { data: totalMinted } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'totalMinted',
    query: {
      enabled: true,
    },
  } as any);

  const handleMint = useCallback((typeId: number) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    writeContract(
      {
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'mintSeed',
        args: [BigInt(typeId), 1n],
      } as any,
      {
        onSuccess: () => {
          toast.success('🌱 Seed planted successfully!');
          addTree(address, typeId);
          setTimeout(() => navigate('/dashboard'), 1500);
        },
        onError: (error) => {
          console.error('Mint error:', error);
          toast.error('Failed to mint seed. Please try again.');
        },
      }
    );
  }, [address, writeContract, navigate]);

  return (
    <div className="min-h-screen zen-gradient-bg">
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-40 right-20 w-48 h-48 bg-accent/20 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between p-4 md:p-6">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="font-serif text-xl text-foreground">Bonsai Zen</span>
          </div>
          <ConnectButton 
            showBalance={false}
            chainStatus="icon"
            accountStatus="avatar"
          />
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-4 py-8 md:py-16">
          <div className="text-center space-y-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif zen-title drop-shadow-lg mb-4">
                Bonsai Zen
              </h1>
              <motion.span
                className="text-4xl md:text-5xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                🌿
              </motion.span>
            </motion.div>

            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Nurture your eternal tree on the blockchain. Mint a seed, grow it daily 
              with water and vitamins, and harvest a beautiful bonsai NFT.
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="flex items-center gap-1 glass px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-primary" />
                Free to mint
              </span>
              <span className="flex items-center gap-1 glass px-4 py-2 rounded-full">
                🌳 20 unique species
              </span>
              <span className="flex items-center gap-1 glass px-4 py-2 rounded-full">
                ✨ 5 rarity levels
              </span>
            </motion.div>
          </div>

          {/* Mint Section */}
          {isConnected ? (
            <MintPreview onMint={handleMint} isMinting={isPending} />
          ) : (
            <motion.div
              className="zen-card p-8 max-w-md mx-auto text-center space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="relative mx-auto w-24 h-24 bg-gradient-to-b from-primary/20 to-primary/5 rounded-full flex items-center justify-center">
                <Leaf className="w-12 h-12 text-primary" />
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{ 
                    boxShadow: [
                      '0 0 20px rgba(16, 185, 129, 0.3)',
                      '0 0 40px rgba(16, 185, 129, 0.5)',
                      '0 0 20px rgba(16, 185, 129, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              
              <div className="space-y-2">
                <h2 className="font-serif text-2xl text-foreground">Begin Your Journey</h2>
                <p className="text-muted-foreground">
                  Connect your wallet to plant your first bonsai seed
                </p>
              </div>
              
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <Button
                    className="w-full zen-button py-6 text-lg"
                    onClick={openConnectModal}
                  >
                    Connect Wallet 🌱
                  </Button>
                )}
              </ConnectButton.Custom>
            </motion.div>
          )}

          {/* Stats */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p className="text-sm text-muted-foreground">
              Total seeds planted:{' '}
              <span className="font-semibold text-primary">
                {totalMinted?.toString() || '0'}
              </span>
            </p>
          </motion.div>

          {/* Dashboard Link */}
          {isConnected && (
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80"
                onClick={() => navigate('/dashboard')}
              >
                View Your Zen Garden →
              </Button>
            </motion.div>
          )}
        </main>

        {/* Footer */}
        <footer className="text-center py-8 text-sm text-muted-foreground">
          <p>Built with 🌿 on Ethereum Sepolia</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
