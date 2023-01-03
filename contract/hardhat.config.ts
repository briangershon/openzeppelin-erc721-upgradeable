import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@openzeppelin/hardhat-upgrades';
import 'hardhat-gas-reporter';

import dotenv from 'dotenv';
dotenv.config();

const TESTNET_RPC = process.env.TESTNET_RPC;
const MAINNET_RPC = process.env.MAINNET_RPC;
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';

const config: HardhatUserConfig = {
    solidity: {
        version: '0.8.9',
        settings: {
            optimizer: {
                enabled: true,
                runs: 1000,
            },
        },
    },
    networks: {
        testnet: {
            url: TESTNET_RPC,
            accounts: [PRIVATE_KEY],
        },
        mainnet: {
            url: MAINNET_RPC,
            accounts: [PRIVATE_KEY],
        },
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY ?? '',
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS ? true : false,
    },
};

export default config;
