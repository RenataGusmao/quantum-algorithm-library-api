const express = require('express')
const cors = require('cors')

const userRoutes = require('./routes/userRoutes')
const authRoutes = require('./routes/authRoutes')
const algoritmoRoutes = require('./routes/algoritmoRoutes')
const tipoProblemaRoutes = require('./routes/tipoProblemaRoutes')
const referenciaRoutes = require('./routes/referenciaRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/users', userRoutes)
app.use('/auth', authRoutes)
app.use('/algoritmos', algoritmoRoutes)
app.use('/tipos-problema', tipoProblemaRoutes)
app.use('/referencias', referenciaRoutes)

module.exports = app