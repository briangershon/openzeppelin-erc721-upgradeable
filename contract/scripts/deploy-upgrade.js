const { ethers, upgrades } = require('hardhat');

async function main() {
    const upgradeableProxyAddress = process.env.UPGRADEABLE_PROXY_ADDRESS;
    if (!upgradeableProxyAddress) {
        console.error(
            'Missing address for OpenZeppelin upgradeable proxy in .env. Required, please set.'
        );
        return;
    }

    // deploy upgradeable contract
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account:', deployer.address);
    console.log('Account balance:', (await deployer.getBalance()).toString());

    const Contract = await ethers.getContractFactory('MyNFTCollection');
    const token = await upgrades.upgradeProxy(
        upgradeableProxyAddress,
        Contract
    );

    console.log(
        `OpenZeppelin Proxy upgraded. Proxy remains at ${token.address}`
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
