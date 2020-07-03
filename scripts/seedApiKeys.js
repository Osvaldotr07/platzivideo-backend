const chalk = require('chalk')
const crypto = require('crypto')
const debug = require('debug')('app:scripts:api-keys')
const MongoLib = require('../lib/mongo')

const adminScope = [
  'signin:auth',
  'signup:auth',
  'read:movies',
  'create:movies',
  'update:movies',
  'delete:movies',
  'read:user-movies',
  'create:user-movies',
  'delete:user-movies'
]

const publicScope = [
  'signin:auth',
  'signup:auth',
  'read:movies',
  'read:user-movies',
  'create:user-movies',
  'delete:user-movies'
]

const apiKeys = [
  {
    token: generateRandomToken(),
    scope: adminScope
  },
  {
    token: generateRandomToken(),
    scope: publicScope
  }
]

function generateRandomToken() {
  const buffer = crypto.randomBytes(32)
  return buffer.toString('hex')
}

async function seedApiKeys() {
  try{
    const mongoDB = new MongoLib()

    const promise = apiKeys.map(async apiKey => {
      await mongoDB.create('api-key', apiKey)
    })

    await Promise.all(promise)
    return process.exit(0)
  }
  catch(error) {
    debug(chalk.red(error))
    process.exit(1)
  }
}

seedApiKeys()