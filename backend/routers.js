const express = require('express');
const router = express.Router();
const { login, signature, register } = require("./controllers/user.controller");
const { verifySignatureMiddleware } = require('./middleware');
const { createCategory } = require('./controllers/category.controller');
const { createBasicProjectWithoutShare, createBasicProjectWithShare } = require('./controllers/project.controller');
const { createEcosystem } = require('./controllers/ecosystem.controller');
const { investmentOpportunities, portfolio, myModel, myModels, allModels } = require('./controllers/intell.controller');
const User = require("./models").user;

router.get('/', (req, res, next) => {
    res.send("hello world");
});

router.get('/login', verifySignatureMiddleware, login)
router.post("/register", verifySignatureMiddleware, register)
router.get("/signature", signature);
router.post("/get-nonce", User.getNonce);

router.post("/add-category", createCategory)

router.post("/create-basic-project-without-share", createBasicProjectWithoutShare)
router.post("/create-basic-project-with-share", createBasicProjectWithShare);

router.post("/create-ecosystem", createEcosystem)

router.get("/investment-opportunities", investmentOpportunities)
router.get("/portfolio", portfolio);

router.get("/my-models", myModels);
router.get("/my-model", myModel);
router.get("/all-models", allModels)

module.exports = router;