// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract CommitReveal {
    address[] public candidates;
    mapping(address => bool) public isCandidate;
    mapping(address => bytes32) public commits;
    bool votingStatus;

    constructor(address[] memory _candidates) {
        require(_candidates.length >= 2, "Minimum number of candidates is 2");

        for (uint256 i = 0; i < _candidates.length; i++) {
            require(
                _candidates[i] != address(0),
                "Don't include zero addresses in the array"
            );
            require(!isCandidate[_candidates[i]], "Duplicated candidate");
            isCandidate[_candidates[i]] = true;
        }
    }
}
