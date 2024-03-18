const { getMostViewedProducts, getOneProduct } = require('../controllers/productController.js');
const utils = require('../utils.js');
const { Op } = require('sequelize');

jest.mock('../models/productModel_mock.js', () => ({
    findAll: jest.fn(),
}));

describe("testInvalidCurrency", () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {
                numberOfProducts: 5,
                currency: "USD", // Default currency
            },
        };
        res = {
            status: jest.fn(() => res),
            send: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should handle invalid currency', async () => {
        req.body.currency = "XYZ"; // Invalid currency

        await getMostViewedProducts(req, res, next);

        await expect(res.status).toHaveBeenCalledWith(200);
        await expect(res.send).toHaveBeenCalledWith({ Message: 'Not a Valid Currency' });
    });
})

describe("getOneProduct", () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {
                currency: "USD", // Default currency
                name: "iPhone"
            },
        };
        res = {
            status: jest.fn(() => res),
            send: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    test('Should Pull given product', async () => {
        await getOneProduct(req, res, next);
        
        await expect(res.status).toHaveBeenCalledWith(200);
    });
})