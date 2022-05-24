# openzeppelin-solidity-hardhat-playground

![Solidity tests](https://github.com/briangershon/openzeppelin-solidity-hardhat-playground/actions/workflows/continuous-integration.yaml/badge.svg)

Develop, test and deploy Solidity contracts based on OpenZeppelin. Use Hardhat development environment. Deploy to Polygon.

Use as a starter template for new Solidity projects.

Initially based on the [OpenZeppelin Learn tutorial](https://docs.openzeppelin.com/learn/).

Tested with Node v16.15 (LTS).

Added:

-   additional testing features
    -   run tests locally (via `npm test`)
    -   use [Chai matchers from Waffle](https://ethereum-waffle.readthedocs.io/en/latest/matchers.html) (instead of OpenZeppelin Test Helpers)
    -   includes Github Action to run tests
-   solhint linter config (and then install plugin for your editor that supports solhint syntax highlighting)
-   format files with Prettier (`npm run style`)
-   configuration to deploy to Polygon Mumbai test network
-   turn on Solidity optimization (1000 means optimize for more high-frequency usage of contract). [Compiler Options](https://docs.soliditylang.org/en/v0.7.2/using-the-compiler.html#input-description)
-   add hardhat-etherscan for verifying contracts on PolygonScan (or Etherscan), which means uploading the source code so it's available for contract users to view/verify. For more info see [hardhat-etherscan plugin](https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html).

## Deploying

### Deploy to Polygon Mumbai Testnet

-   copy `.env.sample` to `.env`
    -   add your Ethereum node RPC URL, for example a url from [Alchemy](https://www.alchemy.com/) or another Ethereum node services.
    -   add your wallet account's private key used for deploying, for example an account created via MetaMask.
    -   to verify contract in a later step, create and add your ETHERSCAN_API_KEY by grabbing your key at <https://polygonscan.com/myapikey>
-   ensure your wallet account has some MATIC via <https://faucet.polygon.technology/>
-   deploy via `npx hardhat run --network mumbai scripts/deploy.js`
-   grab the resulting contract address that you just deployed, let's call that `NEW_CONTRACT_ADDRESS_HERE`
-   optionally, test manually via console -- see [Playing with Contract](#playing-with-contract) below
-   upload source code so others can verify it on-chain via `npx hardhat verify --network mumbai NEW_CONTRACT_ADDRESS_HERE`
-   view contract (and/or call methods directly) in Polygonscan <https://mumbai.polygonscan.com/>, just look up `NEW_CONTRACT_ADDRESS_HERE`

### Deploy to Polygon Mainnet

Use same instructions above for Polygon `Mumbai` testnet but use `--network mainnet` command option instead.

<a id="playing-with-contract"></a>

### Playing with Contract

Interact with it via the console (`npx hardhat console --network mumbai`)

```
await ethers.provider.listAccounts();    // you should see your public wallet account (the match for your private key) listed

const Box = await ethers.getContractFactory('Box');
const box = await Box.attach('<contract address goes here>');
await box.store(42);
// you'll need to wait a bit until value is stored on the blockchain before retrieving in next step
await box.retrieve();   // you'll ultimately see `BigNumber { value: "42" }`
```

### Example deploys

-   On Mumbai testnet: https://mumbai.polygonscan.com/address/0x46d67851d088fa20Bfde7f9516ec22e35D9C7504
-   On Polygon Mainnet: https://polygonscan.com/address/0xD4465A11EAD02D81Bb9BeCfD720f1bDAe36B39F6
