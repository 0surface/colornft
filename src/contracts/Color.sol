pragma solidity 0.5.16;

import "./ERC721Full.sol";

contract Color is ERC721Full {
    string[] public colors;
    mapping(string => bool) colorExists;

    constructor() ERC721Full("Color","COLOR") public {
    }

    function mint(string memory _color) public {
        require(bytes(_color).length == 7);
        require(!colorExists[_color]);
        uint _id = colors.push(_color);
        _mint(msg.sender, _id);
        colorExists[_color] = true;
    }

}