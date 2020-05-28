const express = require('express')
const MovieService = require('../services/movies')

const {
    movieIdSchema,
    createMovieSchema,
    updateMovieSchema
} = require('../utils/schema/movies')

const validationHandlers = require('../utils/middleware/validationHandler')

const cacheResponse = require('../utils/cacheResponse')
const { FIVE_MINUTES_IN_SECONDS, SIXTY_MINUTES_IN_SECONDS } = require('../utils/time.js')

function moviesApi(app) {
    const router = express.Router()
    app.use('/api/movies', router)

    const movieService = new MovieService()
    //get all movies
    router.get('/', async (req, res, next) => {
        cacheResponse(res, FIVE_MINUTES_IN_SECONDS)

        const { tags } = req.query
        try {
            const movies = await movieService.getMovies({tags})
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
    router.get('/:movieId', validationHandlers({movieId: movieIdSchema}, 'params') ,async (req, res, next) => {
        cacheResponse(res, SIXTY_MINUTES_IN_SECONDS)
        const { movieId } = req.params
        try {
            const movies = await movieService.getMovie({ movieId })
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
    router.post('/', validationHandlers(createMovieSchema), async (req, res, next) => {
        const { body: movie } = req
        try {
            const createMovieId = await movieService.createMovie( { movie })
            res.status(201).json({
                data: createMovieId,
                message: 'Movie Created'
            })
        }
        catch(error){
            next(error)
        }
    })

    router.patch('/:movieId', async (req, res, next) => {
        try {
            const { movieId } = req.params
            const { body: movie } = req
    
            const updatedSpecificMovie = await movieService.patchMovie(
                { 
                    movieId,
                    movie 
                }
            )

            res.status(200).json({
                data: updatedSpecificMovie,
                message: 'Updated Movie'
            })
        }
        catch(error){
            next(error)
        }
    })


    router.put('/:movieId', validationHandlers({movieId: movieIdSchema}, 'params'), validationHandlers(updateMovieSchema),async (req, res, next) => {
        const { movieId } = req.params
        const { body: movie } = req

        try {
            const updatedMovieId = await movieService.updateMovie( 
                {
                    movieId, 
                    movie 
                })
            res.status(200).json({
                data: updatedMovieId,
                message: 'Movie Updated'
            })
        }
        catch(error){
            next(error)
        }
    })

    router.delete('/:movieId', validationHandlers({movieId: movieIdSchema}, 'params'),async (req, res, next) => {
        const { movieId } = req.params
        try {
            const deleteMovieId = await movieService.deleteMovie({ movieId })
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