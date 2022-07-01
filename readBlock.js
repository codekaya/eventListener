var Web3 = require('web3');
const fs = require('fs');
const ethers = require('ethers');

//var big = BigNumber.from(10**19);


let fileNumber=0;
let walletInfo = {};
const readAtOnce = 60;
var access;
const initialBalance = /*10**9;*/ethers.utils.formatUnits("1000000000", 18);

for(var i =0;i<readAtOnce;i++){
    fileNumber++;
    let path = "./blockData/Block-"+fileNumber;
    const rawData = fs.readFileSync(path);
    let  jsonData = JSON.parse(rawData);  
    //console.log(path);
    //console.log(jsonData);
    for(var j = 0;j<jsonData.length;++j){
        var issenderExist = 0;
        var isreceiverExist = 0;
        for(var key in walletInfo){
            if(key==jsonData[j][2]){
                issenderExist=1;
                //console.log(issenderExist);
            }
            else if(key==jsonData[j][3]){
                isreceiverExist = 1;
                //console.log(isreceiverExist);
            }
        }
        if(issenderExist){

            //sender
           walletInfo[jsonData[j][2]].Transfers.push([jsonData[j][3],jsonData[j][4]]);
           walletInfo[jsonData[j][2]].Balances.push([jsonData[j][1],/*walletInfo[jsonData[j][2]].Balances[1]-*/parseInt(jsonData[j][4])]);

        }
        if(isreceiverExist){
            //receiver
            walletInfo[jsonData[j][3]].Transfers.push([jsonData[j][2],jsonData[j][4]]);
            walletInfo[jsonData[j][3]].Balances.push([jsonData[j][1],/*walletInfo[jsonData[j][2]].Balances[1]+*/parseInt(jsonData[j][4])]);
        }
        if(!issenderExist){
            // initializing sender
            walletInfo[jsonData[j][2]] = {
                "Transfers" : [[jsonData[j][3],jsonData[j][4]]],
                "Balances" : [[jsonData[j][1]],initialBalance-parseInt(jsonData[j][4])]
            };
            //console.log(jsonData[j][3]);
        }
        if(!isreceiverExist){
            //initializing receiver
            walletInfo[jsonData[j][3]] = {
                "Transfers" : [[jsonData[j][2],jsonData[j][4]]],
                "Balances"  : [[jsonData[j][1]],initialBalance+ parseInt(jsonData[j][4])]
            };
        }
        //console.log(walletInfo);
        
        //console.log(isreceiverExist,issenderExist);
    }
    const FileSystem = require("fs");
    FileSystem.writeFile('walletInfo.json', JSON.stringify(walletInfo), (error) => {
    if (error) throw error;
  });
}