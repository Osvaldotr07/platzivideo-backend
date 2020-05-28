const sinon = require('sinon')


const { movieMocks, filteredMoviesMock } = require('./movies') 

const getAllStub = sinon.stub()

getAllStub.withArgs('movies').resolves(movieMocks)

const tagQuery = { tags: { $in: ['Drama'] } }
getAllStub.withArgs('movies', tagQuery).resolves(filteredMoviesMock('Drama'))

const createStub = sinon.stub().resolves(movieMocks[0].id)

class MongoLibMock {
    getAll(colletion, query ) {
        return getAllStub(colletion, query)
    }

    create(collection, data) {
        return createStub(collection, data)
    }
}

module.exports = {
    getAllStub,
    createStub,
    MongoLibMock
}


