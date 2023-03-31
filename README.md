# openzeppelin-erc721-upgradeable

![Solidity tests](https://github.com/briangershon/openzeppelin-erc721-upgradeable/actions/workflows/continuous-integration.yaml/badge.svg)

Develop, test and deploy an upgradeable NFT contract based on OpenZeppelin ERC721 Solidity framework and Hardhat development environment. Deploy to any EVM blockchain.

Use as a starter template for new projects.

Tested with Node v18 (LTS).

Includes:

-   configuration for deploying to any EVM chain
-   suite of tests
    -   run tests locally with watcher (via `npm test`)
    -   use [Chai matchers from Waffle](https://ethereum-waffle.readthedocs.io/en/latest/matchers.html) (instead of OpenZeppelin Test Helpers)
    -   includes Github Action to run tests
    -   run gas report
    -   run code coverage report
-   generates TypeScript bindings via TypeChain (in `contract/typechain-types`)
-   monorepo-ready -- all contract code and tools are in `./contract` to make it easy to add UI or other pieces
-   solhint linter config (and then install plugin for your editor that supports solhint syntax highlighting)
-   format files with Prettier (`npm run style`)
-   turn on Solidity optimization (1000 means optimize for more high-frequency usage of contract). [Compiler Options](https://docs.soliditylang.org/en/v0.7.2/using-the-compiler.html#input-description)
-   add hardhat-etherscan for verifying contracts on PolygonScan (or Etherscan), which means uploading the source code so it's available for contract users to view/verify. For more info see [hardhat-etherscan plugin](https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html).
-   in VSCode, optionally run your whole environment in a Docker container (config in `.devcontainer`). Learn more about [VSCode: Remote Development in Containers](https://code.visualstudio.com/docs/remote/containers-tutorial)

## Getting Started

Install dependencies and run tests to make sure things are working.

    cd contract
    npm install
    npm test

    npm run test:gas    # to also show gas reporting
    npm run test:coverage   # to show coverage, details in contract/coverage/index.html

## Create and Modifying your own Contract

For first-time setup after creating your repo based on this template, you'll want to rename the contract. Follow these steps:

-   Rename `MyNFTCollection.sol` to the contract name of your choice.
-   Search-and-replace `MyNFTCollection` throughout the code base.
-   You'll probably want to make some changes to `README.md` to make this your own.

Now, try running the tests again and make sure everything is working.

    cd contract
    npm test

Before making many changes, definitely gain more familiarity with Upgradeable contracts, such as how they work, and considerations when you change them: <https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable> and follow link to details on the Proxy too: <https://docs.openzeppelin.com/upgrades-plugins/1.x/proxies#the-constructor-caveat>.

## Deploying

Deploying an upgradeable contract is a bit more complex and 3 contracts are required on initial deploy.

There are two deploy scenarios:

-   First-time deploy of all 3 contracts.
-   Subsequent upgrades of just your 1 contract.

### First setup configuration and fund your wallet

-   copy `.env.sample` to `.env`. Then view and edit `.env` for further instructions on configuring your RPC endpoints, private key and Etherscan API key.
-   for deploys to testnet, ensure your wallet account has some test currency to deploy. For example, on Polygon you want test MATIC via <https://faucet.polygon.technology/> For local testing, Hardhat already provides test currency for you on the local chain.

### Deploy to Testnet

Scenario 1: First-time deploy of all 3 contracts (Proxy, Admin and your actual contract)

-   cd contract
-   deploy via `npx hardhat run --network testnet scripts/deploy.js`
-   once deployed, you'll see `Deployer wallet public key`. Head over to Etherscan (or Polygonscan) and view that account. You'll see 3 contracts recently deployed.
    1.  The first chronologically deployed contract is yours (example: https://mumbai.polygonscan.com/address/0xc858c56f9137aea2508474aa17658de460febb7d#code). Let's call this `CONTRACT_ADDRESS`.
    2.  The second contract is called "ProxyAdmin" (example: https://mumbai.polygonscan.com/address/0xec34f10619f7c0cf30d92d17993e10316a01c884#code).
    3.  The third is called "TransparentUpgradeableProxy" (example: https://mumbai.polygonscan.com/address/0xbf1774e5ba0fe942c7498b67ff93c509b723eb67#code) and this is the address that matches the `OpenZeppelin Proxy deployed to` in the output after running the deploy script. Let's call this `PROXY_ADDRESS`.
-   upload source code so others can verify it on-chain via `npx hardhat verify --network testnet CONTRACT_ADDRESS`. Head back to Etherscan or Polygonscan and view #1 again. You should now see actual source code in the contract.
-   `PROXY_ADDRESS` is that actual address used to interact with the contract, view on OpenSea, etc.
    -   you can interact manually via the console -- see [Playing with Contract](#playing-with-contract) below
    -   you can interact with on Etherscan or Polygonscan
-   **IMPORTANT** You'll notice new files in `.openzeppelin` folder. It's important you keep these files and check them into the repository. They are required for upgrading the contract.

Scenario 2: Upgrade your contract

If you upgrade contract without making any changes, the system will continue to use currently deployed version.

-   cd contract
-   update `UPGRADEABLE_PROXY_ADDRESS` environment variables in `.env` and set to the `PROXY_ADDRESS` from above. This is always the Proxy contract address which doesn't change. Only the `CONTACT_ADDRESS` changes when upgrading.
-   upgrade via `npx hardhat run --network testnet scripts/deploy-upgrade.js`
-   find the newly deployed contract (`CONTRACT_ADDRESS`) from steps above. You'll find the newest contract recently deployed by the deployer wallet labeled as "Contract Creation".
-   upload source code so others can verify it on-chain via `npx hardhat verify --network testnet CONTRACT_ADDRESS`. Head back to Etherscan or Polygonscan and view #1 again. You should now see actual source code in the contract.
-   `PROXY_ADDRESS` is that actual address used to interact with the contract, view on OpenSea, etc.
    -   you can interact manually via the console -- see [Playing with Contract](#playing-with-contract) below
    -   you can interact with on Etherscan or Polygonscan
-   **IMPORTANT** You'll notice changed files in `.openzeppelin` folder. It's important you keep these files and check them into the repository. They are required for upgrading the contract.

### Deploy to Mainnet

If you're happy with everything after testing locally and on testnet, it's time to deploy to production on Mainnet.

Use same instructions above for deploying to testnet but use `--network mainnet` command option instead.

<a id="playing-with-contract"></a>

### Playing with Contract

You can interact with the contract directly in two ways:

1. on Etherscan or Polygonscan
2. You can interact with your contract in real-time via the Hardhat console.

    1. First you connect to your contract
    2. Then you interact with your contract

If you want to go the console route:

**First, Connect to your Contract**

_Running console session on testnet_

1. If you deployed contract to testnet, find your contract address, then just run `npx hardhat console --network testnet`.
2. Jump down to the example interactive console session.

_Running console session on mainnet_

1. If you deployed contract to mainnet, find your contract address, then just run `npx hardhat console --network mainnet`.
2. Jump down to the example interactive console session.

**Second, Interact with your Contract**

Now that you've connected to your contract above via `hardhat console`, let's play with it.

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

## Check out your NFT on OpenSea

Head over to Etherscan or Polygonscan, find your `CONTRACT_ADDRESS`, click "contact" then "write", and run the `mintItem` function to mint a new NFT. Use `0.001` for price (has to be >= mintPrice) and the public wallet address of who will be getting the NFT.

If deployed on Polygon's Mumbai (testnet) you can view by going to https://testnets.opensea.io/assets and filter by MUMBAI chain. You'll see your NFT. Here's an example [query](https://testnets.opensea.io/assets?search[chains][0]=MUMBAI&search[query]=0xc858C56F9137aEA2508474AA17658dE460Febb7d&search[resultModel]=ASSETS).

Which then has a link to the "Unidentified contract - 2l2TWfgZSS" OpenSea collection at https://testnets.opensea.io/collection/unidentified-contract-2l2twfgzss
