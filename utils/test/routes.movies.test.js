const assert = require('assert')
const proxquire = require('proxyquire')

const {movieMocks, MovieServerMock } = require("../mocks/movies.js");

const testServer = require('../serverTest')

describe('routes - movies', function() {
    const route = proxquire('../../routes/movies', {
        "../services/movies": MovieServerMock
    })
    const request = testServer(route)

    describe('GET /movies', function() {
        it('should respond with stats 200', function(done) {
            request.get('/api/movies').expect(200, done)
        })

        it('should respond with the list of movies ', function(done) {
            request.get('/api/movies').end((err, res) =>  {
                assert.deepEqual(res.body, {
                    'data': movieMocks,
                    'message': 'Movies List'
                })
            }) 
            done()
        })
    })
})