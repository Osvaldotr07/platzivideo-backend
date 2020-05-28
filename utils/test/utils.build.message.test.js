const assert = require('assert')
const buildMessage = require('../buildMessage')


describe.only('utils - buildMessage', function() {
    describe('When receives no entity and a an action', function() {
        it('should return the respective message', function() {
            const result = buildMessage('movie', 'create')
            const expect = 'movie created'
            assert.strictEqual(result, expect)
        })
    })

    describe('when receives an entity and an action and is a list', function() {
        it('should return the respect message with the entity in plural', function() {
            const result = buildMessage('movies', 'list')
            const expect = 'movies listed'
            assert.strictEqual(result, expect)
        })
    })
})