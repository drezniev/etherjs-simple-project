// Function to display wallet address on the webpage
function displayWalletAddress(walletAddress) {
  document.getElementById("walletAddress").textContent = walletAddress;
}

// Function to display wallet balance on the webpage
function displayWalletBalance(balance) {
  const formattedBalance = ethers.utils.formatEther(balance);
  document.getElementById("walletBalance").textContent =
    formattedBalance + " ETH";
}

// Function to display transaction history on the webpage
function displayTransactionHistory(history) {
  const transactionHistoryContainer =
    document.getElementById("transactionHistory");

  // Clear previous history
  transactionHistoryContainer.innerHTML = "";

  // Display each transaction in the history
  history.forEach((tx) => {
    const txItem = document.createElement("div");
    txItem.classList.add("transactionItem");
    txItem.innerHTML = `
        <p>Transaction Hash: ${tx.hash}</p>
        <p>From: ${tx.from}</p>
        <p>To: ${tx.to}</p>
        <p>Amount: ${ethers.utils.formatEther(tx.value)} ETH</p>
        <hr>
      `;
    transactionHistoryContainer.appendChild(txItem);
  });
}

// Function to fetch transaction history using Etherscan API
async function fetchTransactionHistory(walletAddress) {
  try {
    const apiKey = "U1KYXYK1CZHMNXZZHCVR5EW8VIIF7E4T78"; // Replace with your Etherscan API key
    const apiUrl = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    return data.result;
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    return [];
  }
}

// Function to handle the wallet connection
async function connectWallet() {
  // Check if the Web3 provider is available
  if (typeof window.ethereum !== "undefined") {
    try {
      // Request access to the user's wallet
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      // Get the first account from the connected wallet
      const walletAddress = accounts[0];

      // Display the wallet address on the webpage
      displayWalletAddress(walletAddress);

      // Get the current wallet balance
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(walletAddress);

      // Display the wallet balance on the webpage
      displayWalletBalance(balance);

      // Get transaction history for the wallet
      const transactionHistory = await fetchTransactionHistory(walletAddress);

      // Display the transaction history on the webpage
      displayTransactionHistory(transactionHistory);

      console.log("Wallet Connected:", walletAddress);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  } else {
    console.error(
      "Web3 provider not found. Please install MetaMask or use a compatible Ethereum wallet."
    );
  }
}

// Function to handle the form submission for sending ETH
async function sendEth(event) {
  event.preventDefault();

  const recipientAddress = document.getElementById("recipientAddress").value;
  const amountInput = document.getElementById("amount").value;
  const amount = ethers.utils.parseEther(amountInput);
  if (amount <= 0 || isNaN(amount)) {
    alert("Please enter a valid amount to send.");
    return;
  }

  try {
    // Check if the Web3 provider is available
    if (typeof window.ethereum !== "undefined") {
      // Request access to the user's wallet
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      // Get the first account from the connected wallet
      const walletAddress = accounts[0];

      // Display the wallet address on the webpage
      displayWalletAddress(walletAddress);

      // Send the ETH transaction
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const transaction = await signer.sendTransaction({
        to: recipientAddress,
        value: amount,
      });

      console.log("Transaction Hash:", transaction.hash);
      alert("Transaction sent! Transaction Hash: " + transaction.hash);
    } else {
      console.error(
        "Web3 provider not found. Please install MetaMask or use a compatible Ethereum wallet."
      );
    }
  } catch (error) {
    console.error("Error sending ETH:", error);
    alert("Error sending ETH: " + error.message);
  }
}

// Add event listener to the connect button
document
  .getElementById("connectButton")
  .addEventListener("click", connectWallet);

// Add event listener to the form submit button
document.getElementById("sendEthForm").addEventListener("submit", sendEth);
