import { loadFixture, ethers, expect } from "./setup";

describe("CommitReveal", function () {
  async function deploy() {
    const [candidate1, candidate2, user] = await ethers.getSigners();

    const CrFactory = await ethers.getContractFactory("CommitReveal", candidate1);
    const cr = await CrFactory.deploy([candidate1, candidate2]);
    await cr.waitForDeployment();

    return { candidate1, candidate2, user, cr }
  }
  describe("CommitReveal deployment", function () {
    it("Deploy test", async function () {
      const { candidate1, candidate2, user, cr } = await loadFixture(deploy);
      expect(await cr.isCandidate(candidate1)).to.eq(true);
      expect(await cr.candidates(0)).to.eq(candidate1.address);
      expect(await cr.votingIsActive()).to.eq(true);
    });

    it("Less than 2 candidates", async function () {
      async function deployWithOneCandidate() {
        const [user1] = await ethers.getSigners();
        const CrFactory = await ethers.getContractFactory("CommitReveal", user1);
        await CrFactory.deploy([user1.address]);
      }
      await expect(loadFixture(deployWithOneCandidate)).to.be.revertedWith("Minimum number of candidates is 2");
    });

    it("Duplicate candidates", async function () {
      async function deployWithDuplicateCandidate() {
        const [user1] = await ethers.getSigners();
        const CrFactory = await ethers.getContractFactory("CommitReveal", user1);
        await CrFactory.deploy([user1.address, user1.address]);
      }
      await expect(loadFixture(deployWithDuplicateCandidate)).to.be.revertedWith("Duplicated candidate");
    });

    it("Zero address among candidates", async function () {
      async function deployWithDuplicateCandidate() {
        const [user1] = await ethers.getSigners();
        const CrFactory = await ethers.getContractFactory("CommitReveal", user1);
        await CrFactory.deploy([user1.address, ethers.ZeroAddress]);
      }
      await expect(loadFixture(deployWithDuplicateCandidate)).to.be.revertedWith("Don't include zero addresses in the array");
    });
  });

  describe("CommitReveal Voting", function () {
    it("Correct scenario", async function () {
      const { candidate1, candidate2, user, cr } = await loadFixture(deploy);

      const secret = "myComplicatedPass";
      const bytes32secret = ethers.encodeBytes32String(secret);

      const hashedVoteData = ethers.solidityPackedKeccak256(["address", "bytes32", "address"], [candidate1.address, bytes32secret, user.address]);

      const tx = await cr.connect(user).commitVote(hashedVoteData);
      await tx.wait();

      const hashedVoteDataStorage = await cr.commits(user);
      expect(hashedVoteDataStorage).to.eq(hashedVoteData);
    })

    it("Commit when closed", async function () {
      const { candidate1, candidate2, user, cr } = await loadFixture(deploy);

      const secret = "myComplicatedPass";
      const bytes32secret = ethers.encodeBytes32String(secret);

      const hashedVoteData = ethers.solidityPackedKeccak256(["address", "bytes32", "address"], [candidate1.address, bytes32secret, user.address]);

      await cr.stopVoting();
      await expect(cr.connect(user).commitVote(hashedVoteData)).to.be.revertedWith("Voting is not active");
    })

    it("Commit twice", async function () {
      const { candidate1, candidate2, user, cr } = await loadFixture(deploy);

      const secret = "myComplicatedPass";
      const bytes32secret = ethers.encodeBytes32String(secret);

      const hashedVoteData = ethers.solidityPackedKeccak256(["address", "bytes32", "address"], [candidate1.address, bytes32secret, user.address]);

      const tx = await cr.connect(user).commitVote(hashedVoteData);
      await tx.wait();

      const hashedVoteDataStorage = await cr.commits(user);
      expect(hashedVoteDataStorage).to.eq(hashedVoteData);

      await expect(cr.connect(user).commitVote(hashedVoteData)).to.be.revertedWith('You have already voted');
    })
  });

  describe("CommitReveal reveal", function () {
    it("Correct scenario", async function () {
      const { candidate1, candidate2, user, cr } = await loadFixture(deploy);

      const secret = "myComplicatedPass";
      const bytes32secret = ethers.encodeBytes32String(secret);

      const hashedVoteData = ethers.solidityPackedKeccak256(["address", "bytes32", "address"], [candidate1.address, bytes32secret, user.address]);

      const txCommit = await cr.connect(user).commitVote(hashedVoteData);
      await txCommit.wait();

      expect(await cr.votesCount(candidate1)).to.eq(0);
      const txReveal = await cr.connect(user).revealVote(candidate1.address, bytes32secret);
      expect(await cr.votesCount(candidate1)).to.eq(1);
    })

    it("Falsification of a vote", async function () {
      const { candidate1, candidate2, user, cr } = await loadFixture(deploy);

      const secret = "myComplicatedPass";
      const bytes32secret = ethers.encodeBytes32String(secret);

      const hashedVoteData = ethers.solidityPackedKeccak256(["address", "bytes32", "address"], [candidate1.address, bytes32secret, user.address]);

      const txCommit = await cr.connect(user).commitVote(hashedVoteData);
      await txCommit.wait();

      await expect(cr.connect(user).revealVote(candidate2.address, bytes32secret)).to.be.revertedWith("Invalid data");
    })
  })
})