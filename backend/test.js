const Web3 = require("web3");
const config = require("./config/index")
const uuid = require("uuid");
const { getTimeNowInTimestamp, getShareLength, investmentOpportunities, getTimestampForNow } = require("./helper");
const { web3 } = require("./helper");

console.log(web3.utils.toWei('1', 'ether'))