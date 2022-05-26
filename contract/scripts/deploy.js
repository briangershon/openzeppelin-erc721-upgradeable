// scripts/deploy.js
const { ethers, upgrades } = require('hardhat');

async function main() {
    // deploy upgradeable contract
    const [deployer] = await ethers.getSigners();
    console.log(
        'Deploy wallet balance:',
        ethers.utils.formatEther(await deployer.getBalance())
    );
    console.log('Deployer wallet public key:', deployer.address);

    const Contract = await ethers.getContractFactory('MyNFTCollection');
    const proxyContract = await upgrades.deployProxy(Contract);
    await proxyContract.deployed();

    console.log(`OpenZeppelin Proxy deployed to ${proxyContract.address}\n\n`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
