// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

/**
    * @title ColibriLedger
    * @dev A contract for managing ledger balances and asset transfers.
    */
contract ColibriLedger {
    
    event WrappedAsset(
        address indexed account,
        uint indexed toChainId,
        uint amount
    );
    
    event Unwrapped(
        address indexed account,
        uint indexed toChainId,
        uint amount
    );
    
    event UpdatedBalance(
        address indexed account, 
        uint indexed toChainId, 
        uint indexed fromChainId,
        uint amount
    );
    
    mapping(address => mapping(uint => uint)) internal balances;
    mapping(address => uint) internal nextExitTimestamp;
    mapping(address=>uint) internal nonces;
    
    address owner;  
    
    constructor() {
        owner = msg.sender;
    }   
    
    /**
        * @dev Modifier to check if the caller is the owner of the contract.
        */
    modifier onlyOwner {
        require(msg.sender == owner, "Ownable: caller is not the owner");
        _;
    }
    
    /**
        * @dev Sets up the wrapping of an asset.
        * @param amount The amount of the asset to wrap.
        * @param toChainId The ID of the chain to wrap the asset to.
        * @param account The address of the account to wrap the asset for.
        */
    function setUpWrap(uint amount, uint toChainId, address account) public /*onlyOwner*/ {
        _updateBalance(amount, toChainId, account);
        nonces[account] += 1;
        emit WrappedAsset(account, toChainId, amount);
    }
    
    /**
        * @dev Sets up the unwrapping of an asset.
        * @param amount The amount of the asset to unwrap.
        * @param toChainId The ID of the chain to unwrap the asset to.
        * @param account The address of the account to unwrap the asset for.
        */
    function setUpUnwrap(uint amount, uint toChainId, address account) public /*onlyOwner*/ {
        _updateBalanceSubtract(amount, toChainId, account);
        nonces[account] += 1;
        emit Unwrapped(account, toChainId, amount);
    }
        
    /**
        * @dev Sets up the transfer of an asset between chains.
        * @param amount The amount of the asset to transfer.
        * @param toChainId The ID of the chain to transfer the asset to.
        * @param account The address of the account to transfer the asset for.
        * @param fromChainId The ID of the chain to transfer the asset from.
        */
    function setupTransfer(uint amount, uint toChainId, address account, uint fromChainId) public /*onlyOwner*/ {
        _updateBalance(amount, toChainId, account, fromChainId);
        nonces[account] += 1;
        emit UpdatedBalance(account, toChainId, fromChainId, amount);
    }
    
    /**
        * @dev Internal function to update the balance of an account on a specific chain.
        * @param amount The amount to add to the balance.
        * @param toChainId The ID of the chain to update the balance for.
        * @param account The address of the account to update the balance for.
        */
    function _updateBalance(uint amount, uint toChainId, address account) internal {
        balances[account][toChainId] += amount;
    }
    
    /**
        * @dev Internal function to subtract an amount from the balance of an account on a specific chain.
        * @param amount The amount to subtract from the balance.
        * @param toChainId The ID of the chain to update the balance for.
        * @param account The address of the account to update the balance for.
        */
    function _updateBalanceSubtract(uint amount, uint toChainId, address account) internal {
        balances[account][toChainId] -= amount;
    }
    
    /**
        * @dev Internal function to update the balances of an account on two different chains.
        * @param amount The amount to add to the toChainId balance and subtract from the fromChainId balance.
        * @param toChainId The ID of the chain to update the toChainId balance for.
        * @param account The address of the account to update the balances for.
        * @param fromChainId The ID of the chain to update the fromChainId balance for.
        */
    function _updateBalance(uint amount, uint toChainId, address account, uint fromChainId) internal {
        balances[account][toChainId] += amount;
        balances[account][fromChainId] -= amount;
    }
    
    /**
        * @dev Gets the balance of an account on a specific chain.
        * @param chainid The ID of the chain to get the balance for.
        * @param account The address of the account to get the balance for.
        * @return The balance of the account on the specified chain.
        */
    function getBalanceAndNonce(uint chainid, address account) public view returns (uint, uint) {
        return (balances[account][chainid], nonces[account]);
    }

    /**
        * @dev Gets the balance of an account on a specific chain.
        * @param chainid The ID of the chain to get the balance for.
        * @param account The address of the account to get the balance for.
        * @return The balance of the account on the specified chain.
        */
    function getBalance(uint chainid, address account) public view returns (uint) {
        return balances[account][chainid];
    }
}
