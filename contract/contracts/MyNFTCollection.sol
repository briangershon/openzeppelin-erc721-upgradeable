// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

contract MyNFTCollection is ERC721Upgradeable, OwnableUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _tokenIds;

    string public baseURI;
    uint256 public mintPrice;

    event LogTokenMinted(address indexed minter, uint256 indexed tokenId);
    event BaseURIUpdated(string indexed oldValue, string indexed newValue);
    event MintPriceUpdated(uint256 indexed oldValue, uint256 indexed newValue);

    function initialize() public initializer {
        __ERC721_init("My NFT Collection", "MNC");
        __Ownable_init();

        baseURI = "ipfs://xxx/";
        mintPrice = 0.001 ether;
    }

    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        emit BaseURIUpdated(baseURI, _newBaseURI);
        baseURI = _newBaseURI;
    }

    function setMintPrice(uint256 _newPrice) external onlyOwner {
        // Mint price in wei
        emit MintPriceUpdated(mintPrice, _newPrice);
        mintPrice = _newPrice;
    }

    function mintItem(address player) external payable returns (uint256) {
        require(mintPrice <= msg.value, "Not enough funds sent");

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(player, newItemId);

        emit LogTokenMinted(player, newItemId);

        return newItemId;
    }
}
