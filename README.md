## Installation

```bash
$ pnpm install
```

## env
```bash
# Redis used for Queue
REDIS_URL="" 
# Private key for the deployed relayer 
PRIVATE_KEY=""
```

## Running the server

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Running UI

```bash
$ npx serve ./app
```

### See the minted NFT here

[Gasless NFT](https://sepolia.etherscan.io/token/0xe3fb3a743d2481a13d590e2443614435a263d5f0)
