import {ethers} from "hardhat";

async function main() {
    console.log("Deploying MedicalProduct contract...");

    // Get the contract factory
    const MedicalProduct = await ethers.getContractFactory("MedicalProduct");

    // Deploy the contract
    const medicalProduct = await MedicalProduct.deploy();

    // Wait for deployment
    await medicalProduct.waitForDeployment();

    // Get the contract address
    const address = await medicalProduct.getAddress();
    console.log(`✅ MedicalProduct deployed to: ${address}`);
}

// Recommended pattern to handle async errors
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
