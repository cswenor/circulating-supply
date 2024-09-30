// public/scripts/main.js

async function fetchCombinedData() {
    try {
      // Show the supply spinner and accounts spinner
      document.getElementById('supply-spinner').style.display = 'flex';
      document.getElementById('accounts-spinner').style.display = 'flex';
  
      // Fetch data from the combined API endpoint
      const response = await fetch('/api/circulating-supply');
      const data = await response.json();
  
      // Update the Circulating Supply (already in base units with decimals)
      const circulatingSupply = data.circulatingSupply;
      document.getElementById('supply-info').innerHTML = `
        <h1>Voi Circulating Supply</h1>
        <p><strong>Total Supply:</strong> 10,000,000,000 VOI</p>
        <p><strong>Circulating Supply:</strong> ${circulatingSupply} VOI</p>
        <p><strong>Percentage Circulating:</strong> ${(circulatingSupply / 10_000_000_000 * 100).toFixed(2)}%</p>
      `;
  
      // Update the Locked Accounts Table
      let tableContent = `
        <thead class="thead-dark">
          <tr>
            <th>Account Address</th>
          </tr>
        </thead>
        <tbody>
      `;
  
      data.lockedAccounts.forEach(account => {
        tableContent += `
          <tr>
            <td>${account}</td>
          </tr>
        `;
      });
  
      tableContent += '</tbody>';
  
      document.getElementById('accounts-table').innerHTML = tableContent;
  
      // Show the accounts table and hide spinner
      document.getElementById('accounts-table').style.display = 'table';
      document.getElementById('accounts-spinner').style.display = 'none';
    } catch (error) {
      console.error('Error fetching combined data:', error);
      document.getElementById('supply-info').innerHTML = `
        <div class="alert alert-danger" role="alert">
          Failed to load circulating supply data.
        </div>
      `;
      document.querySelector('.table-responsive').innerHTML = `
        <div class="alert alert-danger" role="alert">
          Failed to load locked accounts data.
        </div>
      `;
    } finally {
      // Hide the spinners for supply data
      document.getElementById('supply-spinner').style.display = 'none';
    }
  }
  
  // Fetch combined data on page load
  document.addEventListener('DOMContentLoaded', () => {
    fetchCombinedData();
  });
  