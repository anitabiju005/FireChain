const { ethers } = require("hardhat");

async function main() {
  console.log("🔥 Deploying FireChain contracts...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy FireChainToken
  console.log("\n📄 Deploying FireChainToken...");
  const FireChainToken = await ethers.getContractFactory("FireChainToken");
  const fireChainToken = await FireChainToken.deploy();
  await fireChainToken.deployed();
  console.log("✅ FireChainToken deployed to:", fireChainToken.address);

  // Deploy FireIncidentLogger
  console.log("\n📄 Deploying FireIncidentLogger...");
  const FireIncidentLogger = await ethers.getContractFactory("FireIncidentLogger");
  const fireIncidentLogger = await FireIncidentLogger.deploy(fireChainToken.address);
  await fireIncidentLogger.deployed();
  console.log("✅ FireIncidentLogger deployed to:", fireIncidentLogger.address);

  // Deploy EmergencyFundManager
  console.log("\n📄 Deploying EmergencyFundManager...");
  const EmergencyFundManager = await ethers.getContractFactory("EmergencyFundManager");
  const emergencyFundManager = await EmergencyFundManager.deploy(
    fireIncidentLogger.address,
    fireChainToken.address
  );
  await emergencyFundManager.deployed();
  console.log("✅ EmergencyFundManager deployed to:", emergencyFundManager.address);

  // Authorize contracts to mint tokens
  console.log("\n🔑 Setting up permissions...");
  await fireChainToken.authorizeMinter(fireIncidentLogger.address);
  await fireChainToken.authorizeMinter(emergencyFundManager.address);
  console.log("✅ Minting permissions granted");

  // Save deployment addresses
  const deploymentInfo = {
    network: "mumbai",
    fireChainToken: fireChainToken.address,
    fireIncidentLogger: fireIncidentLogger.address,
    emergencyFundManager: emergencyFundManager.address,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString()
  };

  console.log("\n🎉 Deployment completed!");
  console.log("📋 Contract Addresses:");
  console.log("   FireChainToken:", fireChainToken.address);
  console.log("   FireIncidentLogger:", fireIncidentLogger.address);
  console.log("   EmergencyFundManager:", emergencyFundManager.address);
  
  return deploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });