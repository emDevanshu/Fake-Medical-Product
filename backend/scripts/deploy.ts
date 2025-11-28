import {ethers} from "hardhat";
import {readFileSync, writeFileSync, copyFileSync} from "fs";

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

    // 4️⃣ Read existing artifact JSON
    const artifactPath = "./artifacts/contracts/MedicalProduct.sol/MedicalProduct.json";
    const artifact = JSON.parse(readFileSync(artifactPath, "utf8"));

    // 5️⃣ Get network info (Ganache etc.)
    const network = await medicalProduct.runner?.provider?.getNetwork();
    const chainId = network?.chainId?.toString() || "unknown";

    // 6️⃣ Append deployment data
    artifact.address = address;
    artifact.networkId = chainId;

    // 7️⃣ Write back to artifact
    writeFileSync(artifactPath, JSON.stringify(artifact, null, 2));
    console.log("📝 Contract address saved inside artifact JSON.");

    const tx = medicalProduct.deploymentTransaction();
    const receipt = await tx!.wait();

    console.log(`Gas Used: ${receipt?.gasUsed.toString()}`);
    console.log("Gas Price used:", tx!.gasPrice?.toString());
    console.log(`Transaction Cost (ETH): ${ethers.formatEther(receipt!.gasUsed * tx!.gasPrice!)}`);
}

// Recommended pattern to handle async errors
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
