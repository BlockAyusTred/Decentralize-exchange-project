// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Token {
    string public name;
    string public symbol;
    uint256 public decimals = 18;
    uint256 public totalSupply;

    mapping (address => uint256) public balanceOf;

    event Transfer(address indexed sender,address indexed receiver,uint256 amount);

    constructor(string memory _name, string memory _symbol, uint256 _totalSupply) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * ( 10 ** decimals );
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(_to != address(0), "Invalid Address");
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        // deduct the balance of sender
        balanceOf[msg.sender] -= _value;
        // credit tokens to receiver
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
}