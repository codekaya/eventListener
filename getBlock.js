var Web3 = require('web3');
const fs = require("fs");

/*web3.eth.getBlockNumber().then((result) => {
  console.log("Latest BNB Block is ",result);
});*/
async function main() {
  var provider = 'https://bsc-dataseed.binance.org/';
  var web3Provider = new Web3.providers.HttpProvider(provider);
  var web3 = new Web3(web3Provider);
  const transferTopic = web3.utils.sha3("Transfer(address,address,uint256)");
  let blockStarter = 19085790;

  let fetchedBlockNum = 1;

  
  for (let x = 0; x < 60; x++) {
    const logs = await web3.eth.getPastLogs({
      fromBlock: blockStarter.toString(),
      toBlock: blockStarter.toString(),
      topics: [transferTopic],
    });

     console.log(logs);

    let transferEvents = [];

    const filtered = logs.filter(
      (tx) =>
        tx.topics[0] ===
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
    );


    for (var i = 0; i < filtered.length; i++) {
      let blockNumber, txHash, tokenAddress, from, to, amount;
      blockNumber = filtered[i].blockNumber;
      txHash = filtered[i].transactionHash;
      tokenAddress = filtered[i].address;

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

    fs.writeFileSync("blockData/Block-" + fetchedBlockNum.toString(), data, (err) => {
      if (err) {
        throw err;
      }
      console.log("JSON data is saved.");
    });

    blockStarter++;
    fetchedBlockNum++;
  }
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