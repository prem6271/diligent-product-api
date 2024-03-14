
const productController = require('../controllers/productController.js');

// router
const router = require('express').Router();

router.post('/addProduct', productController.addProduct);

router.get('/getOneProduct', productController.getOneProduct);

router.get('/mostViewed', productController.getMostViewedProducts);

router.delete('/deleteOne', productController.deleteProduct);

module.exports = router;