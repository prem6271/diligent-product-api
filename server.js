const express = require('express')
const cors = require('cors')
const router = require('./routes/productRouter.js')
const app = express()
require('dotenv').config();

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// routers
app.use('/api/products', router)

//port
const PORT = process.env.PORT || 9001

//server
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})