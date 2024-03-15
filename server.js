const express = require('express')
const cors = require('cors')
const router = require('./routes/productRouter.js')
const app = express()

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// routers
app.use('/api/products', router)

//port
const PORT = process.env.PORT || 8080

//server
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})