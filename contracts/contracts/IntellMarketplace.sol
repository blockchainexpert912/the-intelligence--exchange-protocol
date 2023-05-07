// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract IntellMarketplace {
    function safeTranfer(address from, address to, uint256 tokenId, IERC721Enumerable nft) external {
        require(nft.isApprovedForAll(from, address(this)) && nft.ownerOf(tokenId) == from, "Not approved");
        nft.safeTransferFrom(from, to, tokenId, "");
    }
}