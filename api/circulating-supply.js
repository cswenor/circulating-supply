// api/circulating-supply.js
const algosdk = require('algosdk');
const fs = require('fs');
const NodeCache = require('node-cache');

// Initialize cache with a TTL of 10 minutes (600 seconds)
const cache = new NodeCache({ stdTTL: 600 });

// Read locked accounts from a flat file on startup
let lockedAccounts = [];
try {
  const data = fs.readFileSync('locked_accounts.txt', 'utf8');
  lockedAccounts = data.split('\n').filter(Boolean);
} catch (err) {
  console.error('Error reading locked accounts file:', err);
}

// Initialize Algod client for Voi blockchain
const algodClient = new algosdk.Algodv2(
  '',
  'https://mainnet-api.voi.nodely.dev',
  ''
);

// Total supply of Voi as BigInt
const TOTAL_SUPPLY = BigInt(10_000_000_000) * BigInt(1_000_000);

// Function to calculate the total balance of locked accounts
async function getLockedAccountsBalance() {
  let totalLockedBalance = BigInt(0);

  for (const account of lockedAccounts) {
    try {
      const accountInfo = await algodClient.accountInformation(account).do();
      totalLockedBalance += BigInt(accountInfo.amount);
    } catch (err) {
      console.error(`Error fetching balance for account ${account}:`, err);
    }
  }

  return totalLockedBalance;
}

module.exports = async (req, res) => {
  try {
    // Check if circulating supply is cached
    let circulatingSupply = cache.get('circulatingSupply');

    if (circulatingSupply === undefined) {
      // Recalculate if not cached or cache has expired
      const lockedBalance = await getLockedAccountsBalance();
      const calculatedSupply = TOTAL_SUPPLY - lockedBalance;

      // Store the new value in cache as a string
      cache.set('circulatingSupply', calculatedSupply.toString());

      circulatingSupply = calculatedSupply;
    } else {
      // Convert cached value back to BigInt
      circulatingSupply = BigInt(circulatingSupply);
    }

    // Set Cache-Control header to cache the response for 10 minutes (600 seconds)
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');

    res.status(200).json({ circulatingSupply: circulatingSupply.toString() });
  } catch (err) {
    console.error('Error in /api/circulating-supply:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
