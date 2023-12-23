// SPDX-License-Identifier: No License
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract GaslessNFT is ERC721 {
    address immutable _trustedForwarder;

    event minted(address minter, uint256 amount);

    constructor(address trustedForwarder) ERC721("Gasless NFT","GNFT") {
        _trustedForwarder = trustedForwarder;
    }

    function mint(uint256 amount) external {
        address sender = msgSender();

        _safeMint(sender, amount);
        emit minted(sender, amount);
    }

    function isTrustedForwarder(address forwarder) public view returns(bool) {
        return forwarder == _trustedForwarder;
    }

    function msgSender() internal view returns (address payable signer) {
        signer = payable(msg.sender);
        if (msg.data.length>=20 && isTrustedForwarder(signer)) {
            assembly {
                signer := shr(96,calldataload(sub(calldatasize(),20)))
            }
            return signer;
        } else {
            revert('invalid call');
        }
    }
}

