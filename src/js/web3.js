export const getWeb3 = async () => {
  let web3Provider;

  // Modern dapp browsers...
  if (window.ethereum) {
    web3Provider = window.ethereum;
    try {
      // Request account access
      await window.ethereum.enable();
    } catch (error) {
      // User denied account access...
      console.error("User denied account access")
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    web3Provider = window.web3.currentProvider;
  } else {
    // If no injected web3 instance is detected, fall back to Ganache
    web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
  }
  return new Web3(web3Provider);
}