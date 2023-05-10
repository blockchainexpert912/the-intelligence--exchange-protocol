const { OFF_CHAIN_DECIAMLS } = require("../config");
const { getTimestampForNow, getOrderStatus, web3 } = require("../helper");

const Marketplace = require("../models").marketplace;


const listForSale = async (req, res, next) => {
    try {
        req.body.price = req.body.price / Math.pow(10, OFF_CHAIN_DECIAMLS);
        const { seller, collection, tokenId, price, duration } = req.body;
        const startTime = await getTimestampForNow();

        const orderStatus = await getOrderStatus(seller, collection, tokenId, web3.utils.toWei(price.toString(), "ether"), startTime, duration)

        const item = await Marketplace.create({
            seller,
            collection,
            tokenId,
            startTime,
            price,
            duration
        });



        res.status(201).json({
            status: "success",
            data: {
                item,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}

module.exports = {
    listForSale
}