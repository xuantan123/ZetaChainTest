const { ethers } = require("hardhat");

async function main() {
    console.log("Deploying ZetaFarm contract...");

    const ZetaFarm = await ethers.getContractFactory("ZetaFarm");

    // Dùng token bạn đã deploy làm CAKE_ADDRESS
    const CAKE_ADDRESS = "0x751bAedcC6e4C70D0D0BeCA920E2db5122088c68"; 

    // Địa chỉ admin (thay bằng ví của bạn)
    const BURN_ADMIN_ADDRESS = "0x641DEa2c82c1114E84E28B8B0A7222c5b34E696B";  

    const zetaFarm = await ZetaFarm.deploy(CAKE_ADDRESS, BURN_ADMIN_ADDRESS);
    await zetaFarm.deployed();

    console.log(`ZetaFarm deployed at: ${zetaFarm.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error during deployment:", error);
        process.exit(1);
    });
