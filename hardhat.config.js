require('dotenv').config();
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-etherscan');
require('@openzeppelin/hardhat-upgrades');

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

// default values are there to avoid failures when running tests
const TESTNET_RPC = process.env.TESTNET_RPC || '1'.repeat(32);
const MAINNET_RPC = process.env.MAINNET_RPC || '1'.repeat(32);
const PRIVATE_KEY = process.env.PRIVATE_KEY || '1'.repeat(64);

module.exports = {
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
};
