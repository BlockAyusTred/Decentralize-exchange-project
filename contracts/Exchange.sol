// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './Token.sol';

contract Exchange {
    address public feeAccount;
    uint256 public feePercent;
    // token address => user address => amount of tokens
    mapping (address => mapping(address => uint256)) public tokens;

    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event Withdrawl(address token, address user, uint256 amount, uint256 balance);

    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    // Deposit Tokens
    function depositToken(address _token, uint256 _amount) public {
        // Transfer tokens to exchange
        require(Token(_token).transferFrom(msg.sender,address(this),_amount));
        // Update user balance
        tokens[_token][msg.sender] += _amount;
        // Emit an event
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    // Withdraw Tokens
    function withdrawToken(address _token, uint256 _amount) public {
        require(tokens[_token][msg.sender] >= _amount, 'Insufficient balance');
        // Transfer tokens to user
        require(Token(_token).transfer(msg.sender,_amount));
        // Update user balance
        tokens[_token][msg.sender] -= _amount;
        // Emit an event
        emit Withdrawl(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    // Check balance
    function balanceOf(address _token, address _user) public view returns (uint256) {
        return tokens[_token][_user];
    }
}