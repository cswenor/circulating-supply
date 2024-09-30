// api/circulating-supply.js
const algosdk = require('algosdk');
const NodeCache = require('node-cache');
const { lockedAccounts, distributingAccounts } = require('./locked-accounts-list'); // Import both locked and distributing accounts

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

// Function to calculate the total balance of any set of accounts
async function getAccountsBalance(accounts) {
  let totalBalance = BigInt(0);

  for (const account of accounts) {
    try {
      const accountInfo = await algodClient.accountInformation(account).do();
      totalBalance += BigInt(accountInfo.amount);
    } catch (err) {
      console.error(`Error fetching balance for account ${account}:`, err);
    }
  }

  return totalBalance;
}

module.exports = async (req, res) => {
  try {
    // Check if circulating and distributed supply are cached
    let circulatingSupply = cache.get('circulatingSupply');
    let distributedSupply = cache.get('distributedSupply');
    let percentDistributed = cache.get('percentDistributed');

    if (!circulatingSupply || !distributedSupply || !percentDistributed) {
      // Get locked and distributing accounts balance
      const lockedBalance = await getAccountsBalance(lockedAccounts);
      const distributingBalance = await getAccountsBalance(distributingAccounts);

      // Calculate circulating supply
      const calculatedSupplyAtomic = TOTAL_SUPPLY - lockedBalance;

      // Calculate distributed supply
      const calculatedDistributedSupply = calculatedSupplyAtomic - distributingBalance;

      // Convert from atomic units to base units (decimals)
      circulatingSupply = Number(calculatedSupplyAtomic) / 1e6;
      distributedSupply = Number(calculatedDistributedSupply) / 1e6;

      // Calculate the percentage of the total supply that is distributed
      percentDistributed = (distributedSupply / 10_000_000_000) * 100;

      // Cache the results
      cache.set('circulatingSupply', circulatingSupply);
      cache.set('distributedSupply', distributedSupply);
      cache.set('percentDistributed', percentDistributed);
    }

    // Send the combined response with circulating supply, distributed supply, and percent distributed
    res.status(200).json({
      circulatingSupply: circulatingSupply.toFixed(6), // Circulating supply in base units
      distributedSupply: distributedSupply.toFixed(6), // Distributed supply in base units
      percentDistributed: percentDistributed.toFixed(2), // Percent distributed, rounded to 2 decimals
      lockedAccounts: lockedAccounts,
      distributingAccounts: distributingAccounts
    });
  } catch (err) {
    console.error('Error in /api/circulating-supply:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
