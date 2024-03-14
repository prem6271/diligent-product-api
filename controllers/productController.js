const db = require('../models')
var Sequelize = require('sequelize');
const Op = Sequelize.Op;


// create main Model
const Product = db.products

// main work

// 1. create product

const addProduct = async (req, res) => {
    console.log('Create New product');

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
    if (product) {
        res.status(200).send(product)
    } else {
        res.status(200).send({ "Message": "Product Not found" })
    }
}

// 3. get most viewed products

const getMostViewedProducts = async (req, res) => {
    console.log('Get Most Viewed product');

    let product = await Product.findAll({
        where: {
            viewCount: {
                [Op.gt]: 0 
            },
            deleted: 0
        },
        order: [ ['viewCount', 'DESC']]

    })
    res.status(200).send(product)
}


// 4. delete product by id

const deleteProduct = async (req, res) => {

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