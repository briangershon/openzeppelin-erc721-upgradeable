# openzeppelin-erc721-upgradeable

![Solidity tests](https://github.com/briangershon/openzeppelin-erc721-upgradeable/actions/workflows/continuous-integration.yaml/badge.svg)

Develop, test and deploy an upgradeable NFT contract based on OpenZeppelin ERC721 Solidity framework and Hardhat development environment. Deploy to any EVM blockchain.

Use as a starter template for new projects.

Tested with Node v16.15 (LTS).

Includes:

-   configuration for deploying to any EVM chain
-   suite of tests
    -   run tests locally (via `npm test`)
    -   use [Chai matchers from Waffle](https://ethereum-waffle.readthedocs.io/en/latest/matchers.html) (instead of OpenZeppelin Test Helpers)
    -   includes Github Action to run tests
-   monorepo-ready -- all contract code and tools are in `./contract` to make it easy to add UI or other pieces
-   solhint linter config (and then install plugin for your editor that supports solhint syntax highlighting)
-   format files with Prettier (`npm run style`)
-   turn on Solidity optimization (1000 means optimize for more high-frequency usage of contract). [Compiler Options](https://docs.soliditylang.org/en/v0.7.2/using-the-compiler.html#input-description)
-   add hardhat-etherscan for verifying contracts on PolygonScan (or Etherscan), which means uploading the source code so it's available for contract users to view/verify. For more info see [hardhat-etherscan plugin](https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html).

## Developing Locally and Running Unit Tests

Install dependencies and run tests to make sure things are working.

    cd contract
    npm install
    npm test

For first-time setup after creating your repo based on this template, you'll want to rename the contract. Follow these steps:

-   Rename `MyNFTCollection.sol` to the contract name of your choice.
-   Search-and-replace `MyNFTCollection` throughout the code base.
-   You'll probably want to make some changes to `README.md` to make this your own.

Now, try running the tests again and make sure everything is working.

    cd contract
    npm test

## Deploying

Deploying an upgradeable contract is a bit more complex and 3 contracts are required on initial deploy.

There are two deploy scenarios:

-   First-time deploy of all 3 contracts.
-   Subsequent upgrades of just your 1 contract.

### Setup configuration and fund your wallet

-   copy `.env.sample` to `.env`. Then view and edit `.env` for further instructions on configuring your RPC endpoints, private key and Etherscan API key.
-   for deploys to testnet, ensure your wallet account has some test currency to deploy. For example, on Polygon you want test MATIC via <https://faucet.polygon.technology/> For local testing, Hardhat already provides test currency for you on the local chain.

### Deploy to Testnet

DOC TODO:

-   [ ] Explain how to find the three contracts and what they do!
-   [ ] Clarify below which contract address to verify, etc.

Scenario 1: First-time deploy of all 3 contracts (Proxy, Admin and your actual contract)

-   cd contract
-   deploy via `npx hardhat run --network testnet scripts/deploy.js`
-   grab the resulting contract address that you just deployed, let's call that `NEW_CONTRACT_ADDRESS_HERE`
-   optionally, test manually via console -- see [Playing with Contract](#playing-with-contract) below
-   upload source code so others can verify it on-chain via `npx hardhat verify --network testnet NEW_CONTRACT_ADDRESS_HERE`
-   view contract (and/or call methods directly) in Polygonscan <https://mumbai.polygonscan.com/>, just look up `NEW_CONTRACT_ADDRESS_HERE`
-   **IMPORTANT** You'll notice new files in `.openzeppelin` folder. It's important you keep these files and check them into the repository. They are required for upgrading the contract.

Scenario 2: Upgrade your contract

-   cd contract
-   add `UPGRADEABLE_PROXY_ADDRESS` in `.env`. This is always the Proxy contract address which doesn't change.
-   upgrade via `npx hardhat run --network testnet scripts/deploy-upgrade.js`
-   **IMPORTANT** You'll notice changed files in `.openzeppelin` folder. It's important you keep these files and check them into the repository. They are required for upgrading the contract.

### Deploy to Mainnet

If you're happy with everything after testing locally and on testnet, it's time to deploy to production on Mainnet.

Use same instructions above for deploying to testnet but use `--network mainnet` command option instead.

<a id="playing-with-contract"></a>

### Playing with Contract

You can interact with your contract in real-time via the Hardhat console.

1. First you connect to your contract
2. Then you interact with your contract

**First, Connect to your Contract**

_Running console session on testnet_

1. If you deployed contract to testnet, find your contract address, then just run `npx hardhat console --network testnet`.
2. Jump down to the example interactive console session.

_Running console session on mainnet_

1. If you deployed contract to mainnet, find your contract address, then just run `npx hardhat console --network mainnet`.
2. Jump down to the example interactive console session.

**Second, Interact with your Contract**

Now that you've connected to your contract above, let's play with it.

```
// first let's ensure we have the right wallet
// run `listAccounts`
// - if you're running on local hardhat you'll see a bunch of accounts created
// - if you're interacting with a contract on testnet or mainnet and you should see your public wallet account (the match for your private key in your `.env` file)
await ethers.provider.listAccounts();

const Contract = await ethers.getContractFactory('MyNFTCollection');
const contract = await Contract.attach('<proxy contract address goes here>');
await contract.setMintPrice('1000000000000000');   // this wei represents 0.001 whole coin (e.g. ETH or MATIC)
// you'll need to wait a bit until value is stored on the blockchain before retrieving in next step
await contract.mintPrice();

// let's mint an NFT using our same owner who deployed the contract for convenience
const owner = (await ethers.provider.listAccounts())[0];
await contract.mintItem(owner, {value: '1000000000000000'});
await contract.ownerOf(1);
```

### Example deploys

-   On Polygon Mumbai testnet, here is the proxy contract: https://mumbai.polygonscan.com/address/0x2b15892adc54273b57102e4506704d2e75722e29#code and the initially deployed contract: https://mumbai.polygonscan.com/address/0xd5f30d08c186a244af7c54ee5cc0949cbf62c762#code
