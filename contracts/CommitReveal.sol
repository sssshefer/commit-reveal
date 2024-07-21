// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract CommitReveal {
    address[] public candidates;
    mapping(address => bool) public isCandidate;
    mapping(address => bytes32) public commits;
    mapping(address => uint) public votesCount;

    bool votingIsActive;

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

    function commitVote(bytes32 _hashedVoteData) external {
        require(votingIsActive, "Voting is not active");
        require(commits[msg.sender] == bytes32(0), "You have already voted");

        commits[msg.sender] = _hashedVoteData;
    }

    function revealVote(address candidate, bytes32 _secret) external {
        require(isCandidate[candidate], "No such candidate");
        bytes32 commit = keccak256(abi.encode(candidate, _secret, msg.sender));
        require(commits[msg.sender] == commit);
        votesCount[candidate]++;
    }

    function stopVoring() external {
        require(votingIsActive, "You cannot stop inactive voting");
        votingIsActive = false;
    }
}
