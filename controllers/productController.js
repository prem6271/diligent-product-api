const db = require('../models')
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
const currencies = "USD CAD EUR GBP";
const utils = require('../utils.js');

// create main Model
const Product = db.products
var currencyData;
/*
(async () => {
    currencyData = await getLatestCurrencyData;
    console.log("currencyData => " + JSON.stringify(currencyData))
})().catch(err => {
    console.error(err);
});
*/


// 1. create product

const addProduct = async (req, res) => {
    console.log('Create New product');

    if (!req.body.name || !req.body.price) {
        res.status(200).send({ "Message": "Product Name or Product Price is Missing" })
        return;
    }

    let info = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description ? req.body.description : null
    }

    const product = await Product.create(info)
    res.status(200).send(product)
    console.log(product)

}

// 2. get single product

const getOneProduct = async (req, res) => {
    console.log("Get One Product");
    var currencyBase = 1;
    if (!req.body.name) {
        res.status(200).send({ "Message": "Product Name is missing" })
        return;
    }

    if (req.body.currency && !currencies.includes(req.body.currency)) {
        res.status(200).send({ "Message": "Not a Valid Currency" })
        return;
    }
    if (req.body.currency != "USD") {
        currencyData = await utils.getLatestCurrencyData();
        currencyBase = currencyData.data[req.body.currency];
    } else {
        currencyBase = 1;
    }

    let name = req.body.name

    let p = await Product.findOne({ where: { name: name, deleted: false } })
    if (p) {
        p.viewCount++;
        let updatedProduct = await Product.update({ viewCount: p.viewCount }, {
            where: {
                name: name,
            },
        });
    }

    let product = await Product.findOne({ where: { name: name, deleted: false } })
    product.price = product.price * currencyBase;
    if (product) {
        res.status(200).send(product)
    } else {
        res.status(200).send({ "Message": "Product Not found" })
    }
}

// 3. get most viewed products

const getMostViewedProducts = async (req, res) => {
    console.log('Get Most Viewed product');
    var currencyBase = 1;
    let product = await Product.findAll({
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
        res.status(200).send({ "Message": "Not a Valid Currency" })
        return;
    }
    if (req.body.currency != "USD") {
        currencyData = await utils.getLatestCurrencyData();
        currencyBase = currencyData.data[req.body.currency];
    } else {
        currencyBase = 1;
    }

    for (var object of product) {
        object.price = object.price * currencyBase;
    }

    res.status(200).send(product)
}


// 4. delete product by id

const deleteProduct = async (req, res) => {
    if (!req.body.name) {
        res.status(200).send({ "Message": "Product Name is missing" })
        return;
    }
    let name = req.body.name
    let p = await Product.findOne({ where: { name: name } })
    p.deleted = 1;
    let updatedProduct = await Product.update({ deleted: p.deleted }, {
        where: {
            name: name,
        },
    });
    res.status(200).send('Product is deleted !')

}

module.exports = {
    addProduct,
    getOneProduct,
    getMostViewedProducts,
    deleteProduct
}