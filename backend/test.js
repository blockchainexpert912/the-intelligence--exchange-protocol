const Web3 = require("web3");
const config = require("./config/index")
const uuid = require("uuid");
const { getTimeNowInTimestamp, getShareLength, investmentOpportunities } = require("./helper");

// const web3 = new Web3()
// console.log(getTimeNowInTimestamp().toString());

// getShareLength().then(res => {
//     console.log(res);
// })

investmentOpportunities().then(res => {
    console.log(res[0][0].shareName)
})

// console.log(Web3.utils.toWei("1", "ether"))