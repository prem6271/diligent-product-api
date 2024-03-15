const { getMostViewedProducts, getOneProduct } = require('../controllers/productController.js');
const utils = require('../utils.js');
const { Op } = require('sequelize');

jest.mock('../models/productModel_mock.js', () => ({
    findAll: jest.fn(),
}));

describe("getMostViewedProducts", () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {
                numberOfProducts: 5,
                currency: 'USD', // Default currency
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
    /*
        test('should get most viewed products in USD currency', async () => {
            const productData = [
                { id: 1, viewCount: 10, price: 20, deleted: 0 },
                { id: 2, viewCount: 15, price: 30, deleted: 0 },
            ];
    
            const currencyData = {
                data: {
                    USD: 1,
                },
            };
    
            utils.getLatestCurrencyData.mockResolvedValue(currencyData);
            require('../models/productModel.js').findAll.mockResolvedValue(productData);
    
    
            await getMostViewedProducts(req, res, next);
    
            expect(res.status).toHaveBeenCalledWith(200);
             expect(res.send).toHaveBeenCalledWith([
                 { id: 1, viewCount: 10, price: 20 },
                 { id: 2, viewCount: 15, price: 30 },
             ]);
           
        });
    */

    test('should handle invalid currency', async () => {
        req.body.currency = 'XYZ'; // Invalid currency

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
                numberOfProducts: 5,
                currency: 'USD', // Default currency
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


    test('Should Pull one product', async () => {
        await getOneProduct(req, res, next);
        
        req.body.name = "iPhone"
        await expect(res.status).toHaveBeenCalledWith(200);
    });
})