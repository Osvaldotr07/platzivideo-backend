const express = require('express')

const app = express()
const bodyParse = require('body-parser')
const debug = require('debug')('app:server')
const { config } = require('./config/index')
const authApi = require('./routes/outh')
const moviesApi = require('./routes/movies')
const userMoviesApi = require('./routes/userMovies')
const { logErrors, errorHandler, wrapErrors} = require('./utils/middleware/errorHandlers')
const notFoundHandler = require('./utils/middleware/notFoundHandler')
const helmet = require('helmet')


app.use(express.json())
app.use(bodyParse.urlencoded({extended: true }))
app.use(helmet())

authApi(app)
moviesApi(app)
userMoviesApi(app)
//capturar el error  404
app.use(notFoundHandler)

//Manejadores de errores
app.use(logErrors)
app.use(wrapErrors)
app.use(errorHandler)


app.listen(config.port, () => {
    debug(`Conectado en http://localhost:${config.port}`)
})
