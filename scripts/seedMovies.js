//DEBUG=app:* node ./scripts/seedUsers.js

const chalk = require('chalk');
const debug = require('debug')('app-scripts:users');
const MongoLib = require('../lib/mongo');

const { moviesMock } = require('../utils/mocks/movies')

async function seedMovies() {
  try {
    const mongoDB = new MongoLib()
    const promise = moviesMock.map(async movie => {
      await mongoDB.create('movies', movie)
    })

    await Promise.all(promise)
    debug(chalk.green(`${promise.length} movies have seen created succesfully`))
    return process.exit(0)
  }
  catch(error) {
    debug(chalk.red(error))
    process.exit(1)
  }
}

seedMovies()