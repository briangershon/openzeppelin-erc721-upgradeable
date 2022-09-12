import { expect } from 'chai';
import { upgrades } from 'hardhat';
import hre from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Contract } from 'ethers';

describe('MyNFTCollection', function () {
    let contract: Contract;
    let owner: SignerWithAddress;
    let otherUser: SignerWithAddress;

    beforeEach(async function () {
        const Contract = await hre.ethers.getContractFactory('MyNFTCollection');

        const [_owner, _otherUser] = await hre.ethers.getSigners();
        owner = _owner;
        otherUser = _otherUser;

        contract = await upgrades.deployProxy(Contract);
        await contract.deployed();
    });

    describe('setters', function () {
        describe('owner', function () {
            it('should successfully set and retrieve baseURI', async () => {
                const newURI = 'ipfs://testuri';
                await contract.setBaseURI(newURI);
                await expect(await contract.baseURI()).to.equal(newURI);
            });

            it('should successfully set and retrieve MintPrice', async () => {
                const newMintPrice = 10;
                await contract.setMintPrice(newMintPrice);
                await expect(await contract.mintPrice()).to.equal(newMintPrice);
            });
        });

        describe('non-owner', function () {
            it('should not be able to setBaseURI', async () => {
                await expect(
                    contract.connect(otherUser).setBaseURI('ipfs://123/')
                ).to.be.revertedWith('Ownable: caller is not the owner');
            });
            it('should not be able to setMintPrice', async () => {
                await expect(
                    contract.connect(otherUser).setMintPrice(1000000)
                ).to.be.revertedWith('Ownable: caller is not the owner');
            });
        });

        describe('emits', function () {
            it('BaseURIUpdated event', async function () {
                await contract.setBaseURI('ipfs://old');
                await expect(contract.setBaseURI('ipfs://new'))
                    .to.emit(contract, 'BaseURIUpdated')
                    .withArgs('ipfs://old', 'ipfs://new');
            });
            it('MintPriceUpdated event', async function () {
                await contract.setMintPrice(5000);
                await expect(contract.setMintPrice(8000))
                    .to.emit(contract, 'MintPriceUpdated')
                    .withArgs(5000, 8000);
            });
        });
    });

    describe('mint', function () {
        it('should not mint if value is below the minimum mintPrice', async function () {
            await contract.setMintPrice(hre.ethers.utils.parseEther('10.0'));
            await expect(
                contract.mintItem(otherUser.address, {
                    value: hre.ethers.utils.parseEther('9.0'),
                })
            ).to.be.revertedWith('Not enough funds sent');
        });

        describe('upon successful mint (when value is equal to mintPrice)', function () {
            it('should emit a LogTokenMinted', async function () {
                await contract.setMintPrice(
                    hre.ethers.utils.parseEther('10.0')
                );
                await expect(
                    contract.mintItem(otherUser.address, {
                        value: hre.ethers.utils.parseEther('10.0'),
                    })
                )
                    .to.emit(contract, 'LogTokenMinted')
                    .withArgs(otherUser.address, 1);
            });

            it('should be owned by otherUser', async function () {
                await contract.setMintPrice(
                    hre.ethers.utils.parseEther('10.0')
                );
                await contract.mintItem(otherUser.address, {
                    value: hre.ethers.utils.parseEther('10.0'),
                });

                await expect(await contract.ownerOf(1)).to.equal(
                    otherUser.address
                );
            });

            it('non-owner should also be successful and emit a LogTokenMinted', async function () {
                await contract.setMintPrice(
                    hre.ethers.utils.parseEther('10.0')
                );
                await expect(
                    contract.connect(otherUser).mintItem(otherUser.address, {
                        value: hre.ethers.utils.parseEther('10.0'),
                    })
                )
                    .to.emit(contract, 'LogTokenMinted')
                    .withArgs(otherUser.address, 1);
            });
        });
    });
});
