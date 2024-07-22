<img src="https://github.com/user-attachments/assets/6a1a669e-95aa-41ad-a2f1-bb3ef05b8a66"/>

# Commit-Reveal
This project is a Solidity-based implementation of the commit-reveal voting pattern on the Ethereum blockchain. This pattern ensures that votes are confidential during the voting phase and only revealed in the subsequent reveal phase, thus preventing any form of early vote manipulation or influence

## Table of Contents

- [Data Accessibility in Solidity](#accessibility-of-data-stored-in-solidity-contracts)
- [Commit-Reveal Pattern](#commit-reveal-pattern)
- [Features and Functionality](#features-and-functionality)
- [Tests](#tests)
- [Running the Project Locally](#running-the-project-locally)

## Accessibility of Data Stored in Solidity Contracts
> [!IMPORTANT]  
> #### All data stored in Solidity contracts is inherently public, as the blockchain functions as a transparent and immutable ledger
Even state variables marked as private are accessible through blockchain explorers or by querying the blockchain directly. This transparency necessitates careful handling of sensitive information: developers should use cryptographic techniques such as hashing and encryption to protect data, and consider off-chain storage for highly sensitive information. In patterns like commit-reveal, hashing is used to maintain the confidentiality of votes until the reveal phase, demonstrating a practical application of these principles

## Commit-Reveal Pattern

The commit-reveal pattern is a common technique in blockchain development used to achieve fairness and privacy in processes such as voting. It consists of two phases:
1. **Commit Phase**: Participants submit a hash of their vote, which keeps their actual vote secret.
2. **Reveal Phase**: Participants reveal their actual votes and a secret value that was used to create the hash during the commit phase. This ensures the vote was not altered after the commit.

This pattern ensures that participants cannot change their vote after seeing other participants' votes, which helps in maintaining the integrity and fairness of the voting process.

## Features and Functionality

- **Secure Voting**: Ensures the integrity and confidentiality of votes using the commit-reveal pattern.
- **Vote Commitment**: Users commit their votes by submitting a hash of the vote and a secret value.
- **Vote Revelation**: Users reveal their votes and secret values to validate their original commitment.
- **Vote Counting**: Keeps track of votes for each candidate and ensures accurate tallying.
- **Voting Lifecycle Management**: Allows for starting and stopping the voting process.

## Tests

The project includes a suite of tests to ensure the functionality and correctness of the contract. The tests are written in TypeScript and use the Hardhat framework:

- **Deployment Tests**: Ensure the contract deploys correctly with valid candidate addresses and handles invalid inputs gracefully.
- **Voting Tests**: Verify the commit and reveal phases, ensuring votes are counted correctly and invalid operations are prevented.

## Running the Project Locally

To run the project locally, follow these steps:

1. **Clone the repository**:
    ```sh
    git clone https://github.com/sssshefer/commit-reveal.git
    cd commit-reveal
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Compile the contracts**:
    ```sh
    npx hardhat compile
    ```

4. **Run the tests**:
    ```sh
    npx hardhat test
    ```

This will run the test suite and ensure everything is working as expected.


*Happy coding!*

<a href="https://ru.freepik.com/free-vector/siluet-voprositel-nogo-znaka-rucnoi-raboty_81102258.htm#fromView=search&page=1&position=5&uuid=b7a2db65-277f-48a5-a72b-96b209dd68e1">Head pic is taken from freepik</a>
