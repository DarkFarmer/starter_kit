pragma solidity ^0.8.0;


// SPDX-License-Identifier: MIT

import "./ERC721Full.sol";

contract Color is ERC721Enumerable {
	string[] public colors;
	mapping(string => bool) _colorExists;

	constructor() ERC721("Color", "COLOR") {

	}

	function mint(string  memory _color) public {

		require(!_colorExists[_color]);
		colors.push(_color);
		uint _id = colors.length;
		_mint(msg.sender, _id);
		_colorExists[_color] = true;

	}

    function totalSupply() public view override returns (uint256) {

      return colors.length;
    }

 
	
}