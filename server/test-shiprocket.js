import axios from 'axios';

// ---------------------------------------------------------
// REPLACE THESE WITH YOUR REAL CREDENTIALS BEFORE RUNNING
// ---------------------------------------------------------
const EMAIL = "vedant.purkar0502@gmail.com";
const PASSWORD = "VYG7p245eJx6dFSuUdZ4h6jH^N7V7Wqk";

async function testConnection() {
  try {
    console.log("1. Logging in...");
    const loginRes = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
      email: EMAIL,
      password: PASSWORD
    });

    const token = loginRes.data.token;
    console.log("✅ Login Successful! Token received.");
    
    // Test 2: Try to READ orders (This usually works even if your wallet is empty)
    console.log("\n2. Testing Read Permissions...");
    const readRes = await axios.get('https://apiv2.shiprocket.in/v1/external/orders', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Read Successful! Found ${readRes.data.data.length} orders.`);

    // Test 3: Check Wallet Balance (Crucial for 403 errors)
    console.log("\n3. Checking Wallet Balance...");
    // Note: Shiprocket doesn't have a direct "get balance" API for external users easily documented, 
    // but if the above works, your API access is active.

  } catch (error) {
    console.log("\n❌ ERROR OCCURRED:");
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log("Response:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(error.message);
    }
  }
}

testConnection();