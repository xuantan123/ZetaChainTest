const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log(`🚀 Deploying Multicall with account: ${deployer.address}`);

    // Triển khai contract Multicall
    const Multicall = await hre.ethers.getContractFactory("Multicall");
    const multicall = await Multicall.deploy();

    await multicall.deployed();
    console.log(`✅ Multicall deployed at: ${multicall.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Lỗi deploy:", error);
        process.exit(1);
    });
