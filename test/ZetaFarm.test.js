const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ZetaFarm Contract", function () {
    let ZetaFarm, zetaFarm, CAKE, cakeToken;
    let owner, user1, user2;

    before(async function () {
        [owner, user1, user2] = await ethers.getSigners();

        // Deploy a mock CAKE token
        const MockToken = await ethers.getContractFactory("MockToken");
        cakeToken = await MockToken.deploy("CAKE", "CAKE", ethers.utils.parseEther("1000000"));
        await cakeToken.deployed();

        // Deploy ZetaFarm contract
        ZetaFarm = await ethers.getContractFactory("ZetaFarm");
        zetaFarm = await ZetaFarm.attach("0x8CDEf4439Ca55Ee0FA45128122695879e96f56e6"); // Attach to the deployed contract
    });

    it("Should add a new pool", async function () {
        await zetaFarm.add(1000, cakeToken.address, true, false);
        expect(await zetaFarm.poolLength()).to.equal(1);
    });

    it("Should deposit LP tokens", async function () {
        // User1 approves and deposits tokens
        await cakeToken.approve(zetaFarm.address, ethers.utils.parseEther("100"));
        await zetaFarm.deposit(0, ethers.utils.parseEther("100"));

        const userInfo = await zetaFarm.userInfo(0, user1.address);
        expect(userInfo.amount).to.equal(ethers.utils.parseEther("100"));
    });

    it("Should withdraw LP tokens", async function () {
        await zetaFarm.withdraw(0, ethers.utils.parseEther("50"));

        const userInfo = await zetaFarm.userInfo(0, user1.address);
        expect(userInfo.amount).to.equal(ethers.utils.parseEther("50"));
    });

    it("Should handle emergency withdraw", async function () {
        await zetaFarm.emergencyWithdraw(0);

        const userInfo = await zetaFarm.userInfo(0, user1.address);
        expect(userInfo.amount).to.equal(0);
    });

    it("Should update burn admin", async function () {
        await zetaFarm.updateBurnAdmin(user2.address);
        expect(await zetaFarm.burnAdmin()).to.equal(user2.address);
    });

    it("Should check pending rewards", async function () {
        // User1 deposits again to check pending rewards
        await cakeToken.approve(zetaFarm.address, ethers.utils.parseEther("100"));
        await zetaFarm.deposit(0, ethers.utils.parseEther("100"));

        // Simulate some time passing
        await ethers.provider.send("evm_increaseTime", [3600]); // Increase time by 1 hour
        await ethers.provider.send("evm_mine"); // Mine a new block

        const pendingRewards = await zetaFarm.pendingCake(0, user1.address);
        expect(pendingRewards).to.be.gt(0); // Check that there are pending rewards
    });
});