const db = require('../models')
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
const currencies = "USD CAD EUR GBP";
const utils = require('../utils.js');
const logger = require("../middleware/logger")

// create main Model
const Product = db.products
var currencyData;


// 1. create product

const addProduct = async (req, res) => {
    logger.log("info", "New Product Creation Endpoint called");

    if (!req.body.name || !req.body.price) {
        res.status(400).send({ "Message": "Product Name or Product Price is Missing" })
        logger.log("info", "Product Name or Product Price is Missing");
        return;
    }

    let info = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description ? req.body.description : null
    }

    let p = await Product.findOne({ where: { name: info.name, deleted: false } })
    if (p) {
        res.status(400).send({ "Message": "Product Name already exists" })
        logger.log("info", "Product Name already exists");
        return;
    }
    try {
        const product = await Product.create(info)
        res.status(200).send(product)
        logger.log("info", "Product Created");
    }
    catch (e) {
        res.status(500).send({ "Message": "Create Product Failed" })
        logger.log("error", e);
        return;
    }
}


// 2. get single product

const getOneProduct = async (req, res) => {
    logger.log("info", "Get One Product Endpoint called");
    var currencyBase = 1;
    var product;
    if (!req.body.name) {
        res.status(400).send({ "Message": "Product Name is missing" })
        logger.log("error", "Product Name is Missing");
        return;
    }

    if (req.body.currency && !currencies.includes(req.body.currency)) {
        res.status(400).send({ "Message": "Not a Valid Currency " + req.body.currency })
        logger.log("error", "Not a Valid Currency " + req.body.currency);
        return;
    }

    if (req.body.currency && req.body.currency != "USD") {
        try {
            currencyData = await utils.getLatestCurrencyData();
            currencyBase = currencyData.data[req.body.currency];
            logger.log("info", "Converted Currency to" + req.body.currency);
        } catch (e) {
            logger.log("error", "Error Converting Currency" + e);
        }
    } else {
        currencyBase = 1;
        logger.log("info", "Using Default Currency i.e. USD");
    }

    let name = req.body.name

    try {
        product = await Product.findOne({ where: { name: name, deleted: false } })

    } catch (e) {
        res.status(500).send({ "Message": "Get Product Failed" })
        logger.log("error", e);
        return;
    }
    if (product && product != undefined) {
        product.viewCount++;
        await Product.update({ viewCount: product.viewCount }, {
            where: {
                name: name,
            },
        });
        product.price = product.price * currencyBase;
        logger.log("info", "Product fetched = " + JSON.stringify(product));
        res.status(200).send(product)

    } else {
        logger.log("error", "Product Not found");
        res.status(404).send({ "Message": "Product Not found" })
        return
    }

}

// 3. get most viewed products

const getMostViewedProducts = async (req, res) => {
    logger.log("info", "Get Most Viewed product Endpoint called");
    var currencyBase = 1;
    let products = await Product.findAll({
        where: {
            viewCount: {
                [Op.gt]: 0
            },
            deleted: 0
        },
        order: [['viewCount', 'DESC']],
        limit: req.body.numberOfProducts || 5

    })

    if (req.body.currency && !currencies.includes(req.body.currency)) {
        res.status(400).send({ "Message": "Not a Valid Currency " + req.body.currency })
        logger.log("error", "Not a Valid Currency " + req.body.currency);
        return;
    }

    if (req.body.currency && req.body.currency != "USD") {
        try {
            currencyData = await utils.getLatestCurrencyData();
            currencyBase = currencyData.data[req.body.currency];
            logger.log("info", "Converted Currency to " + req.body.currency);
        } catch (e) {
            logger.log("error", "Error Converting Currency" + e);
        }
    } else {
        currencyBase = 1;
        logger.log("info", "Using Default Currency i.e. USD");
    }

    for (var object of products) {
        object.price = object.price * currencyBase;
    }

    logger.log("info", "Most Viewed Products " + JSON.stringify(products));
    res.status(200).send(products)
}

// 4. delete product by id

const deleteProduct = async (req, res) => {
    logger.log("info", "Delete One product Endpoint called");
    if (!req.body.name) {
        logger.log("error", "Product Name is missing");
        res.status(400).send({ "Message": "Product Name is missing" })
        return;
    }
    let name = req.body.name
    var p = {}

    try {
        p = await Product.findOne({ where: { name: name } })
        p.deleted = 1;
        logger.log("error", "Adding a Delete flag for Product = " + name);

    } catch (e) {
        logger.log("error", "Product Not found = " + name);
        res.status(404).send({ "Message": "Product Not found = " + name });
        return
    }

    let updatedProduct = await Product.update({ deleted: p.deleted }, {
        where: {
            name: name,
        },
    });

    logger.log("info", "Product deleted = " + p.name);
    res.status(200).send('Product deleted = ' + p.name);

}

module.exports = {
    addProduct,
    getOneProduct,
    getMostViewedProducts,
    deleteProduct
}