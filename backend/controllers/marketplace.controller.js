const User = require("../models").user;
const helper = require("../helper");
const uuid = require("uuid")

const login = async (req, res, next) => {
    try {
        if (await User.hasAccount(req.signer))
            return res.send({ hasAccount: true });
        else return res.send({ hasAccount: false });
    }
    catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}


const createEcosystem = async (req, res, next) => {
    try {
        const { name, logo, about, verified } = req.body;

        const ecosystem = await Ecosystem.create({
            name, logo, about, verified
        });

        res.status(201).json({
            status: "success",
            data: {
                ecosystem,
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
    createEcosystem
}

const generateSignature = async () => {
    const authMsg = getAuthMsg(config.NONCE);
    const { signature } = web3.eth.accounts.sign(authMsg, config.USER_PRIVATE_KEY)
    return { signature, address: config.ADMIN_ADDRESS, nonce: config.NONCE }
}

const recoverSignature = async (signature) => {
    return await web3.eth.accounts.recover(getAuthMsg(config.NONCE), signature)
}

const multiCall = async (abi, calls) => {
    const itf = new Interface(config.INTELL_SCAN_ABI)

    const calldata = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)])
    const { returnData } = await multiCallContract.methods.aggregate(calldata).call();
    const res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call))

    return res;
}

const getTimeNowInTimestamp = () => {
    let _dateTime = new Date(Date.now());
    _dateTime = _dateTime.getTime() / 1000;
    _dateTime = Math.round(_dateTime);

    return _dateTime;
}

const getAuthMsg = (nonce) => config.MESSAGE + " " + nonce;

const toCheckSumAddress = (_address) => web3.utils.toChecksumAddress(_address)

const sameAddresses = (_address1, _address2) => toCheckSumAddress(_address1) === toCheckSumAddress(_address2)

const getShareLength = async () => {
    const shareLen = await factoryContract.methods.allShareNFTAddrsLength().call();
    return shareLen;
}

const hexToDecimal = hex => parseInt(hex, 16);

const bigNumberToDecimal = bigNumber => hexToDecimal(bigNumber._hex, 16);

const getInvestmentOpportunities = async () => {
    var calls = [];
    var _shareLen = await getShareLength();
    for (let i = 0; i < _shareLen; i++) {
      calls.push({ address: config.INTELL_SCAN_ADDRESS, name: 'singleInvestmentChance', params: [i] })
    }

    const result = await multiCall(config.INTELL_SCAN_ABI, calls);
    return result;
}

const register = async (req, res, next) => {
    const fromUS = false;
    const { firstName, lastName, email, wallet, phone, ecosystemId } = req.body;

    if (!helper.sameAddresses(req.signer, wallet))
        return res.status(500).json({
            status: "error",
            message: "500 - Signature Error",
        });

    if ((await User.hasAccount(wallet))) {
        return res.status(403).json({
            status: "error",
            messsage: "403 - Already Exists"
        })
    }

    try {
        const user = await User.create({
            firstName,
            lastName,
            email,
            wallet,
            phone,
            ecosystemId,
            fromUS,
            nonce: uuid.v4()
        });

        return res.status(201).json({
            status: "success",
            data: {
                user,
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message,
        });
    }

}

const signature = async (req, res, next) => {
    const signature = await helper.generateSignature();
    res.send(signature)
}


const login = async (req, res, next) => {
    try {
        if (await User.hasAccount(req.signer))
            return res.send({ hasAccount: true });
        else return res.send({ hasAccount: false });
    }
    catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}

const register = async (req, res, next) => {
    const fromUS = false;
    const { firstName, lastName, email, wallet, phone, ecosystemId } = req.body;

    if (!helper.sameAddresses(req.signer, wallet))
        return res.status(500).json({
            status: "error",
            message: "500 - Signature Error",
        });

    if ((await User.hasAccount(wallet))) {
        return res.status(403).json({
            status: "error",
            messsage: "403 - Already Exists"
        })
    }

    try {
        const user = await User.create({
            firstName,
            lastName,
            email,
            wallet,
            phone,
            ecosystemId,
            fromUS,
            nonce: uuid.v4()
        });

        return res.status(201).json({
            status: "success",
            data: {
                user,
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message,
        });
    }

}

const signature = async (req, res, next) => {
    const signature = await helper.generateSignature();
    res.send(signature)
}

module.exports = {
    login
}

module.exports = {
    register,
    signature,
    login
}