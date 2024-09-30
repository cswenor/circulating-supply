// api/locked-accounts.js
const fs = require('fs');

module.exports = (req, res) => {
  let lockedAccounts = [];
  try {
    const data = fs.readFileSync('locked_accounts.txt', 'utf8');
    lockedAccounts = data.split('\n').filter(Boolean);
  } catch (err) {
    console.error('Error reading locked accounts file:', err);
  }
  // Set Cache-Control header
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
  res.status(200).json({ lockedAccounts });
};
