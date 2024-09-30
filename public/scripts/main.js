// public/scripts/main.js

async function fetchCirculatingSupply() {
    try {
      // Show the supply spinner
      document.getElementById('supply-spinner').style.display = 'flex';
  
      const response = await fetch('/api/circulating-supply');
      const data = await response.json();
      const circulatingSupply = Number(data.circulatingSupply) / 1e6;
  
      // Calculate percentage circulating
      const totalSupply = 10_000_000_000;
      const percentageCirculating = (circulatingSupply / totalSupply) * 100;
  
      // Update the supply-info container
      document.getElementById('supply-info').innerHTML = `
        <h1>Voi Circulating Supply</h1>
        <p><strong>Total Supply:</strong> ${totalSupply.toLocaleString()} VOI</p>
        <p><strong>Circulating Supply:</strong> ${circulatingSupply.toLocaleString(undefined, { maximumFractionDigits: 2 })} VOI</p>
        <p><strong>Percentage Circulating:</strong> ${percentageCirculating.toFixed(2)}%</p>
      `;
    } catch (error) {
      console.error('Error fetching circulating supply:', error);
      document.getElementById('supply-info').innerHTML = `
        <div class="alert alert-danger" role="alert">
          Failed to load circulating supply data.
        </div>
      `;
    } finally {
      // Hide the supply spinner
      document.getElementById('supply-spinner').style.display = 'none';
    }
  }
  
  async function fetchLockedAccounts() {
    try {
      // Show the accounts spinner
      document.getElementById('accounts-spinner').style.display = 'flex';
  
      const response = await fetch('/api/locked-accounts');
      const data = await response.json();
      const lockedAccounts = data.lockedAccounts;
  
      let tableContent = `
        <thead class="thead-dark">
          <tr>
            <th>Account Address</th>
          </tr>
        </thead>
        <tbody>
      `;
  
      lockedAccounts.forEach(account => {
        tableContent += `
          <tr>
            <td>${account}</td>
          </tr>
        `;
      });
  
      tableContent += '</tbody>';
  
      // Update the accounts table
      document.getElementById('accounts-table').innerHTML = tableContent;
      // Show the accounts table
      document.getElementById('accounts-table').style.display = 'table';
    } catch (error) {
      console.error('Error fetching locked accounts:', error);
      document.querySelector('.table-responsive').innerHTML = `
        <div class="alert alert-danger" role="alert">
          Failed to load locked accounts data.
        </div>
      `;
    } finally {
      // Hide the accounts spinner
      document.getElementById('accounts-spinner').style.display = 'none';
    }
  }
  
  // Fetch data on page load
  document.addEventListener('DOMContentLoaded', () => {
    fetchCirculatingSupply();
    fetchLockedAccounts();
  });
  