const express = require('express')

const app = express()
const bodyParse = require('body-parser')
const debug = require('debug')('app:server')
const { config } = require('./config/index')
const moviesApi = require('./routes/movies')
const { logErrors, errorHandler, wrapErrors} = require('./utils/middleware/errorHandlers')
const notFoundHandler = require('./utils/middleware/notFoundHandler')

app.use(express.json())
app.use(bodyParse.urlencoded({extended: true }))

moviesApi(app)
//capturar el error  404
app.use(notFoundHandler)

//Manejadores de errores
app.use(logErrors)
app.use(wrapErrors)
app.use(errorHandler)


app.listen(config.port, () => {
    debug(`Conectado en http://localhost:${config.port}`)
})
