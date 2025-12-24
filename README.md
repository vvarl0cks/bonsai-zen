# 🌿 Bonsai Zen

A serene Web3 gamified bonsai tree growing game on Ethereum Sepolia testnet. Mint free random rarity seed NFTs (ERC-1155), nurture daily with water and vitamins, and harvest into beautiful bonsai NFTs.

## Features

- **Mint Seeds**: Get random rarity seed NFTs for free (Common, Uncommon, Rare, Epic, Legendary)
- **20 Real Bonsai Species**: Ficus, Juniper, Japanese Maple, Pine, Azalea, and more
- **Daily Nurturing**: Water (+5%) and Vitamin (+10%) actions with 24h cooldowns
- **Procedural Canvas Art**: Unique recursive tree drawings that grow with progress
- **Harvest NFTs**: Transform fully grown seeds into permanent Bonsai NFTs

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **UI Components**: shadcn/ui
- **Web3**: RainbowKit + wagmi + viem
- **Animations**: Framer Motion
- **Chain**: Ethereum Sepolia Testnet

## Smart Contract

- **Network**: Ethereum Sepolia
- **Contract**: `0xd91917fc778C7C22859B4C9acC9B5cc29DB61776`
- **Explorer**: [View on Etherscan](https://sepolia.etherscan.io/address/0xd91917fc778c7c22859b4c9acc9b5cc29db61776)

## Getting Started

```sh
# Install dependencies
npm install

# Start development server
npm run dev
```

## How to Play

1. **Connect Wallet**: Use any Web3 wallet (MetaMask, etc.) on Sepolia network
2. **Mint a Seed**: Click "Surprise Me" to randomize, then mint your seed NFT
3. **Nurture Daily**: Water and feed vitamins to grow your tree (progress stored locally)
4. **Harvest**: Once at 100%, harvest to convert your seed into a Bonsai NFT

## Rarity System

| Rarity | Weight | Multiplier |
|--------|--------|------------|
| Common | 70% | 1.0x |
| Uncommon | 20% | 1.0x |
| Rare | 7% | 1.0x |
| Epic | 2% | 1.0x |
| Legendary | 1% | 1.0x |

## License

MIT
