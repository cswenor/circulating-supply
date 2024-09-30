// api/combined-data.js
const algosdk = require('algosdk');
const NodeCache = require('node-cache');
const lockedAccounts = require('./locked-accounts-list'); // Import the locked accounts list

// Initialize cache with a TTL of 10 minutes (600 seconds)
const cache = new NodeCache({ stdTTL: 60 });

// Initialize Algod client for Voi blockchain
const algodClient = new algosdk.Algodv2(
  '', // No token required
  'https://mainnet-api.voi.nodely.dev',
  '' // No port required
);

// Total supply of Voi as BigInt (in atomic units)
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

    if (!circulatingSupply) {
      // Recalculate if not cached or cache has expired
      const lockedBalance = await getLockedAccountsBalance();
      const calculatedSupplyAtomic = TOTAL_SUPPLY - lockedBalance;

      // Convert from atomic units to base units (decimals) before caching
      circulatingSupply = Number(calculatedSupplyAtomic) / 1e6;

      // Cache the result (already in base units with decimals)
      cache.set('circulatingSupply', circulatingSupply);
    }

    // Send the combined response with circulating supply (in base units with decimals) and locked accounts
    res.status(200).json({
      circulatingSupply: circulatingSupply.toFixed(6), // Always return 6 decimal places
      lockedAccounts: lockedAccounts,
    });
  } catch (err) {
    console.error('Error in /api/circulating-supply:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
