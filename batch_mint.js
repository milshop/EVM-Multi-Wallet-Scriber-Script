const { ethers } = require("ethers");

// 配置你的私钥和对应的目标地址
const privateKeys = [
  "[privateKey1]", // 替换为你的第一个私钥
  "[privateKey2]", // 替换为你的第二个私钥
  // ... 添加更多私钥
];
const toAddresses = [
  "[address1]", // 对应第一个私钥的目标地址
  "[address2]", // 对应第二个私钥的目标地址
  // ... 添加更多目标地址
];

// 连接到 Polygon 节点
const provider = new ethers.providers.JsonRpcProvider(
  "[rpc_provider]"
);

// 自定义十六进制数据
const hexData =
  "[]"; // 替换为你想要的十六进制数据

// 获取当前账户的 nonce
async function getCurrentNonce(wallet) {
  try {
    const nonce = await wallet.getTransactionCount("pending");
    console.log("Nonce:", nonce);
    return nonce;
  } catch (error) {
    console.error("Error fetching nonce:", error.message);
    throw error;
  }
}

// 获取当前主网 gas 价格
async function getGasPrice() {
  const gasPrice = await provider.getGasPrice();
  return gasPrice;
}

// 转账交易
async function sendTransaction(wallet, toAddress, nonce, gasPrice) {
  const transaction = {
    to: toAddress,
    value: ethers.utils.parseEther("0"), // 替换为你要转账的金额
    data: hexData,
    nonce: nonce,
    gasPrice: gasPrice,
    gasLimit: 30000,
  };

  try {
    const tx = await wallet.sendTransaction(transaction);
    console.log(`Transaction with nonce ${nonce} hash:`, tx.hash);
  } catch (error) {
    console.error(`Error in transaction with nonce ${nonce}:`, error.message);
  }
}

// 休眠函数
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 定义重复次数
const repeatCount = 100; // 设置打印的数量

// 发送多次交易
async function sendTransactions() {
  privateKeys.forEach(async (privateKey, index) => {
    const wallet = new ethers.Wallet(privateKey, provider);
    const toAddress = toAddresses[index];
    const currentNonce = await getCurrentNonce(wallet);
    const gasPrice = await getGasPrice();

    for (let i = 0; i < repeatCount; i++) {
      await sendTransaction(wallet, toAddress, currentNonce + i, gasPrice);
      await sleep(500); // 在每次交易后休眠1秒钟
    }
  });
}

sendTransactions();
