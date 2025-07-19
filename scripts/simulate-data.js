const { ethers } = require("hardhat");

// Mock satellite/drone data simulation
const mockFireData = [
  {
    location: "Yellowstone National Park, WY",
    description: "Satellite detected thermal anomaly in forest area",
    latitude: 44.4280,
    longitude: -110.5885,
    severity: 2 // High
  },
  {
    location: "Angeles National Forest, CA",
    description: "Drone surveillance identified smoke plumes",
    latitude: 34.2411,
    longitude: -117.8443,
    severity: 3 // Critical
  },
  {
    location: "Great Smoky Mountains, TN",
    description: "Automated fire detection system alert",
    latitude: 35.6532,
    longitude: -83.5070,
    severity: 1 // Medium
  },
  {
    location: "Olympic National Forest, WA",
    description: "Thermal imaging detected hotspot",
    latitude: 47.8021,
    longitude: -123.6044,
    severity: 0 // Low
  }
];

async function simulateFireData() {
  console.log("🛰️  Starting fire data simulation...");
  
  // Get contract addresses from deployment
  const FIRE_INCIDENT_LOGGER_ADDRESS = process.env.FIRE_INCIDENT_LOGGER_ADDRESS;
  
  if (!FIRE_INCIDENT_LOGGER_ADDRESS) {
    console.error("❌ Please set FIRE_INCIDENT_LOGGER_ADDRESS in .env file");
    return;
  }

  const [signer] = await ethers.getSigners();
  const fireIncidentLogger = await ethers.getContractAt(
    "FireIncidentLogger",
    FIRE_INCIDENT_LOGGER_ADDRESS,
    signer
  );

  console.log("📡 Simulating satellite/drone fire detection data...");

  for (let i = 0; i < mockFireData.length; i++) {
    const fire = mockFireData[i];
    
    try {
      console.log(`\n🔥 Reporting incident ${i + 1}/${mockFireData.length}:`);
      console.log(`   Location: ${fire.location}`);
      console.log(`   Severity: ${['Low', 'Medium', 'High', 'Critical'][fire.severity]}`);
      
      // Convert coordinates to fixed-point integers (multiply by 1e6 for precision)
      const lat = Math.floor(fire.latitude * 1e6);
      const lng = Math.floor(fire.longitude * 1e6);
      
      const tx = await fireIncidentLogger.reportIncident(
        fire.location,
        fire.description,
        lat,
        lng,
        fire.severity
      );
      
      const receipt = await tx.wait();
      console.log(`   ✅ Transaction hash: ${receipt.transactionHash}`);
      
      // Add delay between reports to simulate real-world timing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`   ❌ Failed to report incident: ${error.message}`);
    }
  }

  console.log("\n🎉 Fire data simulation completed!");
  
  // Get total incidents count
  const totalIncidents = await fireIncidentLogger.getTotalIncidents();
  console.log(`📊 Total incidents in system: ${totalIncidents}`);
}

async function verifyRandomIncidents() {
  console.log("\n🔍 Starting random incident verification...");
  
  const FIRE_INCIDENT_LOGGER_ADDRESS = process.env.FIRE_INCIDENT_LOGGER_ADDRESS;
  const [signer] = await ethers.getSigners();
  const fireIncidentLogger = await ethers.getContractAt(
    "FireIncidentLogger",
    FIRE_INCIDENT_LOGGER_ADDRESS,
    signer
  );

  const totalIncidents = await fireIncidentLogger.getTotalIncidents();
  
  if (totalIncidents.toNumber() === 0) {
    console.log("❌ No incidents to verify");
    return;
  }

  // Verify some incidents randomly
  const incidentsToVerify = Math.min(3, totalIncidents.toNumber());
  
  for (let i = 1; i <= incidentsToVerify; i++) {
    try {
      // Randomly choose verification status (mostly verified for demo)
      const statuses = [1, 1, 1, 2]; // Mostly verified, some resolved
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      console.log(`\n✅ Verifying incident ${i}...`);
      const tx = await fireIncidentLogger.verifyIncident(i, randomStatus);
      const receipt = await tx.wait();
      
      const statusNames = ['Reported', 'Verified', 'Resolved', 'False'];
      console.log(`   Status set to: ${statusNames[randomStatus]}`);
      console.log(`   Transaction hash: ${receipt.transactionHash}`);
      
    } catch (error) {
      console.error(`   ❌ Failed to verify incident ${i}: ${error.message}`);
    }
  }
}

async function main() {
  await simulateFireData();
  await verifyRandomIncidents();
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Simulation failed:", error);
      process.exit(1);
    });
}

module.exports = { simulateFireData, verifyRandomIncidents };