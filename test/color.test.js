const Color = artifacts.require("Color");
const { assert } = require("chai");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("Color", (accounts) => {
  let contract;
  describe("deployment", async () => {
    it("deploys successfully", async () => {
      contract = await Color.deployed();
      const contractAddress = contract.address;
      console.log("address", contractAddress);
      assert.notEqual(contractAddress, "");
    });
  });
});
