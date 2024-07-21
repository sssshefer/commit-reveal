import { loadFixture, ethers, expect } from "./setup";

describe("CommitReveal", function () {
  async function deploy() {
    const [candidate1, candidate2, user] = await ethers.getSigners();

    const CrFactory = await ethers.getContractFactory("CommitReveal", candidate1);
    const cr = await CrFactory.deploy([candidate1, candidate2]);
    await cr.waitForDeployment();

    return { candidate1, candidate2, user, cr }
  }

  describe("Commit-reveal voting", function () {
    it("Correct scenario", async function () {
      const { candidate1, candidate2, user, cr } = await loadFixture(deploy);
      
      expect(await cr.isCandidate(candidate1)).to.eq(true);
      const secret = "myComplicatedPass";
      const bytes32secret = ethers.encodeBytes32String(secret);

      const hashedVoteData = ethers.solidityPackedKeccak256(["address", "bytes32", "address"], [candidate1.address, bytes32secret, user.address]);

      const tx = await cr.commitVote(hashedVoteData);
      await tx.wait();

      const hashedVoteDataStorage = await cr.commits(candidate1);
      expect(hashedVoteDataStorage).to.eq(hashedVoteData);
    })
  })
});