const express = require('express')
const { movieMocks } = require('../utils/mocks/movies.js')

function moviesApi(app) {
    const router = express.Router()
    app.use('/api/movies', router)

    //get all movies
    router.get('/', async (req, res, next) => {
        try {
            const movies = await Promise.resolve(movieMocks)
            res.status(200).json({
                data: movies,
                message: 'Movies List'
            })
        }
        catch(error){
            next(error)
        }
    })
    //get specific movie 
    router.get('/:movieId', async (req, res, next) => {
        try {
            const movies = await Promise.resolve(movieMocks[0])
            res.status(200).json({
                data: movies,
                message: 'Movie Retrived'
            })
        }
        catch(error){
            next(error)
        }
    })

    //create a movie
    router.post('/', async (req, res, next) => {
        try {
            const createMovieId = await Promise.resolve(movieMocks[0].id)
            res.status(201).json({
                data: createMovieId,
                message: 'Movie Created'
            })
        }
        catch(error){
            next(error)
        }
    })

    router.put('/:movieId', async (req, res, next) => {
        try {
            const updatedMovieId = await Promise.resolve(movieMocks[0].id)
            res.status(200).json({
                data: updatedMovieId,
                message: 'Movie Updated'
            })
        }
        catch(error){
            next(error)
        }
    })

    router.delete('/:movieId', async (req, res, next) => {
        try {
            const deleteMovieId = await Promise.resolve(movieMocks[0].id)
            res.status(200).json({
                data: deleteMovieId,
                message: 'Movie Deleted'
            })
        }
        catch(error){
            next(error)
        }
    })
}

module.exports = moviesApi