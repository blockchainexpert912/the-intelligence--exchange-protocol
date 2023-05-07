const { getShareLength, getInvestmentOpportunities, bigNumberToDecimal, getSharePortfolio, getModels, getModel, getAllModels, ModelMetadata, ShareMetadata } = require("../helper");
const Project = require("../models").project;

const investmentOpportunities = async (req, res, next) => {
    const invs = await getInvestmentOpportunities();
    const result = [];

    for (let inv of invs) {
        inv = inv[0];
        console.log(inv)
        const modelId = bigNumberToDecimal(inv[1]);
        const project = await Project.findByPk(modelId);


        result.push(ModelMetadata(inv, project));
    }
    return res.send(result);
}

const portfolio = async (req, res, next) => {
    const collections = await getSharePortfolio("0x171c8C090511bc95886c9AAc505dB3081FE72F97");
    const result = [];

    for (let i = 0; i < collections.length; i++) {
        let collection = collections[i][0];

        for (let item of collection) {
            const modelId = bigNumberToDecimal(item[2]);
            const project = await Project.findByPk(modelId);

            result.push(ShareMetadata(item, project));
        }


    }

    return res.send(result);
}

const getModelsInDetail = async (_owner) => {
    const models = await getModels(_owner);
    const result = [];

    for (let model of models) {
        console.log(model)
        const project = await Project.findByPk(model[1]);

        result.push(ModelMetadata(model, project));
    }

    return result;
}

const getModelInDetail = async (_tokenId) => {
    const modelInDetail = await getModel(_tokenId);

    return modelInDetail;

}

//Data Scientist
const myModels = async (req, res, next) => {
    const models = await getModelsInDetail("0x171c8C090511bc95886c9AAc505dB3081FE72F97");
    return res.send(models);
}

const myModel = async (req, res, next) => {
    const model = await getModelInDetail(2);
    const project = await Project.findByPk(model[1]);

    return res.send(ModelMetadata(model, project));

}

//Business
const allModels = async (req, res, next) => {
    const models = await getAllModels();
    const result = [];
    for (let model of models) {
        model = model[0];
        console.log(model)
        const project = await Project.findByPk(bigNumberToDecimal(model[1]));

        result.push(ModelMetadata(model, project));
    }

    return res.send(result);
}



module.exports = {
    investmentOpportunities,
    portfolio,
    myModels,
    myModel,
    allModels,
}