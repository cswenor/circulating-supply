# Voi Circulating Supply API

This repository provides a Node.js application that displays the circulating supply of the Voi blockchain, a fork of Algorand, along with a list of locked (out of supply) accounts. The application is designed to be deployed on Vercel and includes endpoints for fetching the circulating supply and locked accounts data.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running Locally](#running-locally)
- [API Documentation](#api-documentation)
  - [`GET /api/circulating-supply`](#get-apicirculating-supply)
  - [`GET /api/locked-accounts`](#get-apilocked-accounts)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Additional Information](#additional-information)
  - [General Information](#general-information)
  - [How to Use the API](#how-to-use-the-api)
  - [Dependencies](#dependencies)
  - [Notes on Caching](#notes-on-caching)
- [Contact](#contact)

---

## Features

- **Circulating Supply Calculation:** Fetches the total supply of Voi and subtracts the balances of locked accounts to determine the circulating supply.
- **Locked Accounts Listing:** Displays a list of accounts that are considered out of supply.
- **Caching Mechanism:** Implements caching to reduce the number of requests to the blockchain endpoints.
- **Loading Animations:** Provides a better user experience with loading animations during data fetching.
- **Responsive Design:** Uses Bootstrap for a modern and responsive user interface.
- **API Endpoints:** Offers two API endpoints for fetching circulating supply and locked accounts data.

---

## Getting Started

### Prerequisites

- **Node.js** (version 12 or higher)
- **npm** (Node Package Manager)
- **Vercel CLI** (for deployment)
- **Git** (for version control)

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/voi-circulating-supply.git
   cd voi-circulating-supply
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

### Configuration

1. **Locked Accounts File:**

   - Create a file named `locked_accounts.txt` in the root directory.
   - List each locked account address on a separate line:

     ```
     ACCOUNT_ADDRESS_1
     ACCOUNT_ADDRESS_2
     ACCOUNT_ADDRESS_3
     ```

### Running Locally

1. **Install Vercel CLI (if not already installed):**

   ```bash
   npm install -g vercel
   ```

2. **Log in to Vercel:**

   ```bash
   vercel login
   ```

3. **Run the Development Server:**

   ```bash
   vercel dev
   ```

4. **Access the Application:**

   Open your browser and navigate to `http://localhost:3000`

---

## API Documentation

### `GET /api/circulating-supply`

**Description:**

Fetches the current circulating supply of the Voi blockchain. The circulating supply is calculated by subtracting the total balance of the locked (out of supply) accounts from the total supply.

**URL:**

```
/api/circulating-supply
```

**Method:**

```
GET
```

**Headers:**

- `Content-Type: application/json`

**Response Codes:**

- `200 OK` — Request was successful.
- `500 Internal Server Error` — An error occurred on the server.

**Response Format:**

Returns a JSON object containing the circulating supply in atomic units (smallest denomination of Voi).

**Response Fields:**

- `circulatingSupply` *(string)*: The circulating supply in atomic units.

**Example Request:**

```bash
GET https://your-app.vercel.app/api/circulating-supply
```

**Example Response:**

```json
{
  "circulatingSupply": "9500000000000000"
}
```

**Notes:**

- The `circulatingSupply` value is returned as a string to accommodate very large numbers.
- To convert `circulatingSupply` to standard units, divide by `1e6` (assuming Voi has 6 decimal places like Algorand).
- The data is cached for 10 minutes to reduce load on the blockchain endpoints.
- The response includes caching headers to cache the data at the edge.

---

### `GET /api/locked-accounts`

**Description:**

Retrieves a list of account addresses that are considered locked (out of supply).

**URL:**

```
/api/locked-accounts
```

**Method:**

```
GET
```

**Headers:**

- `Content-Type: application/json`

**Response Codes:**

- `200 OK` — Request was successful.
- `500 Internal Server Error` — An error occurred on the server.

**Response Format:**

Returns a JSON object containing an array of locked account addresses.

**Response Fields:**

- `lockedAccounts` *(array of strings)*: An array of locked account addresses.

**Example Request:**

```bash
GET https://your-app.vercel.app/api/locked-accounts
```

**Example Response:**

```json
{
  "lockedAccounts": [
    "ACCOUNT_ADDRESS_1",
    "ACCOUNT_ADDRESS_2",
    "ACCOUNT_ADDRESS_3"
  ]
}
```

**Notes:**

- The list of locked accounts is loaded from `locked_accounts.txt` on the server.
- The data is cached for 1 minutes to improve performance.
- The response includes caching headers to cache the data at the edge.

---

## Deployment

To deploy the application to Vercel:

1. **Build and Deploy:**

   ```bash
   vercel --prod
   ```

2. **Set Environment Variables (if any):**

   - In the Vercel dashboard, navigate to your project settings and set any required environment variables.

3. **Access Your Deployed Application:**

   - Your application will be available at `https://your-app.vercel.app`

---

## Project Structure

```
voi-circulating-supply/
├── api/
│   ├── circulating-supply.js     # Serverless function for circulating supply
│   └── locked-accounts.js        # Serverless function for locked accounts
├── public/
│   ├── index.html                # Main HTML page
│   └── scripts/
│       └── main.js               # Client-side JavaScript
├── locked_accounts.txt           # List of locked accounts
├── package.json                  # Project dependencies and scripts
├── vercel.json                   # Vercel configuration
└── README.md                     # Project documentation
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/YourFeature
   ```

3. **Commit Your Changes**

   ```bash
   git commit -m "Add Your Feature"
   ```

4. **Push to Your Branch**

   ```bash
   git push origin feature/YourFeature
   ```

5. **Open a Pull Request**

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Additional Information

### General Information

- **Base URL:** All API endpoints are relative to the base URL:

  ```
  https://your-app.vercel.app
  ```

  Replace `your-app.vercel.app` with your actual deployed application URL.

- **Authentication:** No authentication is required to access these endpoints.

- **Rate Limiting:** Currently, there are no enforced rate limits. However, please be considerate and avoid making excessive requests.

- **Error Handling:** Errors will return a JSON object with an `error` field describing the issue.

  **Example Error Response:**

  ```json
  {
    "error": "Internal server error"
  }
  ```

### How to Use the API

#### Fetching Circulating Supply

You can fetch the circulating supply by sending a `GET` request to `/api/circulating-supply`.

**JavaScript Example Using Fetch API:**

```javascript
fetch('https://your-app.vercel.app/api/circulating-supply')
  .then(response => response.json())
  .then(data => {
    const circulatingSupply = Number(data.circulatingSupply) / 1e6;
    console.log(`Circulating Supply: ${circulatingSupply.toLocaleString()} VOI`);
  })
  .catch(error => console.error('Error fetching circulating supply:', error));
```

#### Fetching Locked Accounts

You can fetch the list of locked accounts by sending a `GET` request to `/api/locked-accounts`.

**JavaScript Example Using Fetch API:**

```javascript
fetch('https://your-app.vercel.app/api/locked-accounts')
  .then(response => response.json())
  .then(data => {
    const lockedAccounts = data.lockedAccounts;
    console.log('Locked Accounts:', lockedAccounts);
  })
  .catch(error => console.error('Error fetching locked accounts:', error));
```

### Dependencies

- **algosdk**: To interact with the Voi blockchain.
- **node-cache**: For caching data within serverless functions.
- **Bootstrap**: For styling the frontend.
- **Vercel**: For deployment.

### Notes on Caching

- **Cache-Control Headers:** Responses from the API endpoints include `Cache-Control` headers to enable caching at Vercel's edge network.
- **Cache Duration:** Data is cached for 10 minutes (`s-maxage=600`), reducing the number of requests to the blockchain endpoints.
- **Stale-While-Revalidate:** The `stale-while-revalidate` directive allows serving stale content while revalidating in the background.

---

## Contact

For any issues or questions, please open an issue in the GitHub repository or contact the maintainer.

---

**Thank you for using the Voi Circulating Supply API!**
```

---

You can copy the above content into a file named `README.md` in your project's root directory. This README includes all the necessary information, including detailed API documentation, to help users understand and use your application.

If you need any further assistance or have additional requests, feel free to ask!