// scripts/deploy.js
const { ethers, upgrades } = require('hardhat');

async function main() {
    // deploy upgradeable contract
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account:', deployer.address);
    console.log('Account balance:', (await deployer.getBalance()).toString());

    const Contract = await ethers.getContractFactory('MyNFTCollection');
    const contract = await upgrades.deployProxy(Contract);
    await contract.deployed();

    console.log(`OpenZeppelin Proxy deployed to: ${contract.address}\n\n`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
