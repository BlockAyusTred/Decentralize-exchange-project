// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Token.sol";

contract Exchange {
    address public feeAccount;
    uint256 public feePercent;
    uint256 public orderCount;
    // token address => user address => amount of tokens
    mapping(address => mapping(address => uint256)) public tokens;
    // id => order
    mapping (uint256 => _Order) public orders;

    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event Withdrawl(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );
     event Order (
        uint256 id,         
        address user,       
        address tokenGet,   
        uint256 amountGet,  
        address tokenGive,  
        uint256 amountGive, 
        uint256 timestamp  
    );

    struct _Order {
        // Attributes of an order
        uint256 id;         // Unique identifier for order
        address user;       // User who made order
        address tokenGet;   // Address of the token they receive
        uint256 amountGet;  // Amount they receive
        address tokenGive;  // Address of the token they give
        uint256 amountGive; // Amount they give
        uint256 timestamp;  // When order was created  
    }

    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    // Deposit Tokens
    function depositToken(address _token, uint256 _amount) public {
        // Transfer tokens to exchange
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));
        // Update user balance
        tokens[_token][msg.sender] += _amount;
        // Emit an event
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    // Withdraw Tokens
    function withdrawToken(address _token, uint256 _amount) public {
        require(tokens[_token][msg.sender] >= _amount, "Insufficient balance");
        // Transfer tokens to user
        require(Token(_token).transfer(msg.sender, _amount));
        // Update user balance
        tokens[_token][msg.sender] -= _amount;
        // Emit an event
        emit Withdrawl(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    // Check balance
    function balanceOf(
        address _token,
        address _user
    ) public view returns (uint256) {
        return tokens[_token][_user];
    }

    // --------------------------
    // MAKE & CANCEL ORDERS

    // Token Give (the token they want to spend) - which token, and how much?
    // Token Get (the token they want to receive) - which token, and how much?
    function makeOrder(
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) public {
        // Require token balance
        require(balanceOf(_tokenGive,msg.sender) >= _amountGive, "Insufficient balance");

        // instantiate a new order
        orderCount++;
        orders[orderCount] = _Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp 
        );

        // emit an event
        emit Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp 
        );
    }
}
