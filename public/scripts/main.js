// public/scripts/main.js

async function fetchCombinedData() {
  try {
    // Show the supply spinner and accounts spinners
    document.getElementById('supply-spinner').style.display = 'flex';
    document.getElementById('locked-accounts-spinner').style.display = 'flex';
    document.getElementById('distributing-accounts-spinner').style.display = 'flex';

    // Fetch data from the API
    const response = await fetch('/api/circulating-supply');
    const data = await response.json();

    // Format the Circulating Supply with commas and 6 decimal places
    const circulatingSupply = parseFloat(data.circulatingSupply).toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6 });

    // Format the Distributed Supply with commas and 6 decimal places
    const distributedSupply = parseFloat(data.distributedSupply).toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6 });

    // Get the percent distributed
    const percentDistributed = data.percentDistributed;

    // Update the Circulating and Distributed Supply on the webpage
    document.getElementById('supply-info').innerHTML = `
      <h1>Voi Blockchain Supply</h1>
      <p><strong>Total Supply:</strong> 10,000,000,000 VOI</p>
      <p><strong>Circulating Supply:</strong> ${circulatingSupply} VOI</p>
      <p><strong>Distributed Supply:</strong> ${distributedSupply} VOI</p>
      <p><strong>Percentage Circulating:</strong> ${(parseFloat(data.circulatingSupply) / 10_000_000_000 * 100).toFixed(2)}%</p>
      <p><strong>Percentage Distributed:</strong> ${percentDistributed}%</p>
    `;

    // Populate Locked Accounts Table
    let lockedTableContent = `
      <thead class="thead-dark">
        <tr>
          <th>Account Address</th>
        </tr>
      </thead>
      <tbody>
    `;

    data.lockedAccounts.forEach(account => {
      lockedTableContent += `
        <tr>
          <td>${account}</td>
        </tr>
      `;
    });

    lockedTableContent += '</tbody>';
    document.getElementById('locked-accounts-table').innerHTML = lockedTableContent;

    // Populate Distributing Accounts Table
    let distributingTableContent = `
      <thead class="thead-dark">
        <tr>
          <th>Account Address</th>
        </tr>
      </thead>
      <tbody>
    `;

    data.distributingAccounts.forEach(account => {
      distributingTableContent += `
        <tr>
          <td>${account}</td>
        </tr>
      `;
    });

    distributingTableContent += '</tbody>';
    document.getElementById('distributing-accounts-table').innerHTML = distributingTableContent;

    // Show the accounts tables and hide the spinners
    document.getElementById('locked-accounts-table').style.display = 'table';
    document.getElementById('distributing-accounts-table').style.display = 'table';
    document.getElementById('locked-accounts-spinner').style.display = 'none';
    document.getElementById('distributing-accounts-spinner').style.display = 'none';
  } catch (error) {
    console.error('Error fetching combined data:', error);
    document.getElementById('supply-info').innerHTML = `
      <div class="alert alert-danger" role="alert">
        Failed to load supply data.
      </div>
    `;
    document.querySelector('.table-responsive').innerHTML = `
      <div class="alert alert-danger" role="alert">
        Failed to load accounts data.
      </div>
    `;
  } finally {
    // Hide the supply spinner
    document.getElementById('supply-spinner').style.display = 'none';
  }
}

// Fetch combined data on page load
document.addEventListener('DOMContentLoaded', () => {
  fetchCombinedData();
});
