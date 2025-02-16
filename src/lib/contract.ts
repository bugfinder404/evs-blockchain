import { ThirdwebSDK } from "@thirdweb-dev/sdk";

const sdk = new ThirdwebSDK("mainnet"); 
const contract = sdk.getContract("YOUR_CONTRACT_ADDRESS"); // Replace with your deployed contract address

export { contract };
