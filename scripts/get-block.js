const { Web3 } = require("hardhat");
const fs = require("fs");
const { SupportedAlgorithm } = require("ethers/lib/utils");

async function main() {
  const web3 = new Web3("https://bsc-dataseed.binance.org/");

  const transferTopic = web3.utils.sha3("Transfer(address,address,uint256)");
  let blockStarter = 19085790;
  for (let x = 0; x < 100; x++) {
    const logs = await web3.eth.getPastLogs({
      fromBlock: blockStarter.toString(),
      toBlock: blockStarter.toString(),
      topics: [transferTopic],
    });

    //console.log(transferTopic);
    //console.log(logs.length);
    // console.log(logs);

    let transferEvents = [];

    const filtered = logs.filter(
      (tx) =>
        tx.topics[0] ===
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
    );

    // [[transferEvent1], [transferEvent2], ...]

    for (var i = 0; i < filtered.length; i++) {
      let blockNumber, txHash, tokenAddress, from, to, amount;
      blockNumber = filtered[i].blockNumber;
      txHash = filtered[i].transactionHash;
      tokenAddress = filtered[i].address;

      //topics her zaman tum veriyi icermiyor
      //topics amount veya diger verileri icermediginde data icerisinde bulunuyor
      //data'yi parcalayip topicse ekliyoruz

      let data = filtered[i].data.substring(2);
      let topics = [...filtered[i].topics];
      for (var j = 0; j < data.length; j += 64)
        topics.push("0x" + data.substring(j, j + 64));

      from = topics[1];
      to = topics[2];
      amount = topics[3];

      transferEvents.push([blockNumber, txHash, from, to, amount]);
    }

    const data = JSON.stringify(transferEvents);

    fs.writeFileSync("Block:" + blockStarter.toString(), data, (err) => {
      if (err) {
        throw err;
      }
      console.log("JSON data is saved.");
    });

    blockStarter++;
  }

  /*
{
  address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',  // token adresi (para birimi)
  topics: [
    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',  // Transfer event signature (Transfer iceren tum islemlerde ayni)
    '0x00000000000000000000000058f876857a02d6762e0101bb5c46a8c1ed44dc16',  // parayi gonderen adres
    '0x00000000000000000000000010ed43c718714eb63d5aa57b78b54704e256024e'  // alici adres
  ],
  data: '0x000000000000000000000000000000000000000000000000003b7aedf0473d30',  // transfer amount
  blockNumber: 19086682,
  transactionIndex: 166,
  removed: false,
  transactionHash: '0x2d15b53561486f6d5ad4e7c51f0f2264fed9d884de96830b10c407a9d027de73',
  blockHash: '0xb7dc958b2cd64394ee8d0bec9bc69b4e9c13767aa457e6ca0fe33768bc9b940b',
  logIndex: 497,
  id: 'log_a5c34a03'
}  

    */

  /*for (var i = 0; i < logs.length; i++) {
    console.log(logs[i]);
  }*/

  //console.log(a);

  //   const block = await web3.eth.getBlock("19085693", true);
  //   console.log(block.transactions[0]);

  //   const tx = await web3.eth.getTransaction(
  //     "0x876a083ee8da998d1d39e6fc85fff6087540a189008ded74414a7d518445b8e7"
  //   );
  //   console.log(tx);

  //   for (var i = 0; i < 1; i++) {
  //     const txHash = block.transactions[i];
  //     console.log(typeof txHash);
  //   }
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
