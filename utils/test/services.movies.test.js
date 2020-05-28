const assert = require('assert')
const proxyquire = require('proxyquire')

const {MongoLibMock, getAllStub} = require('../mocks/mongoLib.js')
const { movieMocks } = require('../mocks/movies')

describe('service - movies', function() {
    const MoviesServices = proxyquire('../../services/movies', {
        '../lib/mongo': MongoLibMock
    })

    const moviesServices = new MoviesServices
    
    describe('When getMovies method is called', async function() {
        it('should call the getall MongoLib method', async function() {
            await moviesServices.getMovies({})
            assert.strictEqual(getAllStub.called, true)
        })

        it('should return an array of movies', async function() {
            const result = await moviesServices.getMovies({})
            const expect = movieMocks

            assert.deepEqual(result, expect)
        })
    })
})