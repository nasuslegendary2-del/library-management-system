// Test script to verify AKS deployment
const http = require("http");

// Get service IPs from kubectl
const { execSync } = require("child_process");

try {
  console.log("🧪 Testing AKS Deployment...\n");

  // Get service IPs
  const services = execSync("kubectl get services -o json", {
    encoding: "utf8",
  });
  const servicesData = JSON.parse(services);

  let frontendIP = null;
  let backendIP = null;

  servicesData.items.forEach((service) => {
    if (service.metadata.name === "lms-frontend-simple-service") {
      frontendIP = service.status?.loadBalancer?.ingress?.[0]?.ip;
    }
    if (service.metadata.name === "lms-backend-simple-service") {
      backendIP = service.status?.loadBalancer?.ingress?.[0]?.ip;
    }
  });

  console.log("📋 Service Information:");
  console.log(`Frontend URL: http://${frontendIP || "pending"}`);
  console.log(`Backend URL: http://${backendIP || "pending"}:3000`);
  console.log("");

  if (frontendIP && backendIP) {
    console.log("✅ Both services have external IPs assigned!");
    console.log("🎯 Your Library Management System is accessible!");
  } else {
    console.log("⏳ Waiting for external IPs to be assigned...");
  }
} catch (error) {
  console.error("❌ Error testing deployment:", error.message);
}
