// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract IntellMarketplace {
    using Strings for uint256;
    using SafeMath for uint256;

    struct OrderStatus {
        bool status;
    }

    address public truthHolder = 0xF8AbE936Ff2bCc9774Db7912554c4f38368e05A2;
    IERC20 public intellToken = 0xd9145CCE52D386f254917e481eB44e9943F39138;

    mapping(bytes32 => bool) private orderHashStatus;

    function transferERC721(
        address from,
        address to,
        uint256 tokenId,
        IERC721Enumerable nft
    ) external {
        require(
            nft.isApprovedForAll(from, address(this)) &&
                nft.ownerOf(tokenId) == from,
            "Not approved"
        );
        nft.safeTransferFrom(from, to, tokenId, "");
    }

    function transferERC20(
        address from,
        address to,
        uint256 amount,
        IERC20 tokenAddr
    ) external {}

    function sellerValidate() external view returns (bool) {
        return true;
    }

    function buyerValidate() external view returns (bool) {
        return true;
    }

    function cancel() external view returns (bool) {
        return true;
    }

    function buyIntellShareNFT(bytes calldata message, bytes calldata signature)
        external
    {
        require(
            verifyMessage(message, signature),
            "Need to sign from truth holder"
        );

        (
            address buyer,
            address seller,
            address collection,
            uint256 tokenId,
            uint256 price,
            uint256 startTime,
            uint256 duration,
            uint256 id,
            bytes32 orderHash
        ) = abi.decode(
                message,
                (address, address, address, uint256, uint256, uint256, uint256, uint256, bytes32)
            );

        bytes32 _orderHash = keccak256(abi.encode(seller, collection, tokenId, price, startTime, duration, id));
        IERC721Enumerable nftCollection = IERC721Enumerable(collection);

        require(_orderHash == orderHash, "Order Hash is not correct");
        require(!orderHashStatus[orderHash], "Cancelled or Traded");
        require(startTime.add(duration) <= block.timestamp, "Expired");

        // Seller Status
        require(nftCollection.isApprovedForAll(seller, address(this)), "Is not approved for all");
        require(nftCollection.ownerOf(tokenId) == seller, "Seller doesn't have tokenId");

        // Buyer Status
        require(intellToken.balanceOf(buyer) <= price, "INTELL token Insufficent Error");
        require(intellToken.allowance(buyer, address(this)) >= price, "Not approved from INTELL token");

        // transfers nft to buyer
        nftCollection.safeTransfer(seller, buyer, tokenId, "");

        // transfers INTELL token to seller
        intellToken.transferFrom(buyer, seller, price);


        orderHashStatus[orderHash] = true;
    }

    function recoverSigner(bytes32 hash, bytes memory signature)
        internal
        pure
        returns (address)
    {
        bytes32 messageDigest = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
        );
        return ECDSA.recover(messageDigest, signature);
    }

    function verifyMessage(bytes memory message, bytes memory signature)
        internal
        view
        returns (bool)
    {
        bytes32 hash = keccak256(message);
        return recoverSigner(hash, signature) == truthHolder;
    }
}
