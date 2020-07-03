const express = require('express')
const passport = require('passport')
const boom = require('@hapi/boom')
const jwt = require('jsonwebtoken')

const { config } = require('../config')
const ApiKeysService = require('../services/apiKeys')
const UserService = require('../services/users')
const validationHandler = require('../utils/middleware/validationHandler')
const { createUserSchema, createProviderUserSchema } = require('../utils/schema/users')

//basic startegy
require('../utils/auth/strategies/basic')

function authApi(app) {
  const router = express.Router()
  app.use('/api/auth/', router)

  const apiKeysService = new ApiKeysService()
  const userService = new UserService()

  router.post('/sign-in', async (req, res, next) => {
    const { apiKeyToken } = req.body
    if(!apiKeyToken){
      next(boom.unauthorized('apiKeyToken is required'))
    }

    passport.authenticate('basic', function(error, user){
      try{

        if(error || !user){
          next(boom.unauthorized())
        }

        req.login(user, {session: false}, async function(error){
          if(error){
            next(error)
          }

          const apiKey = await apiKeysService.getApiKey({ token: apiKeyToken });

          if(!apiKey) {
            next(boom.unauthorized())
          }

          const {_id: id, name, email } = user


          const payload = {
            sub: id,
            name, 
            email,
            scopes: apiKey.scope
          }

          const token = jwt.sign(payload, config.authJwtSecret, {
            expiresIn: '15m'
          })

          return res.status(200).json({
            token,
            user: { id, name, email }
          })
        })
      }
      catch(error){
        next(error)
      }
    })(req, res, next)
  })

  router.post('/sign-up', validationHandler(createUserSchema), async (req, res, next) => {
    const { body: user} = req

    try {
      const createUserId = await userService.createUser({ user })

      res.status(201).json({
        data: createUserId,
        message: 'user created'
      })
    }
    catch(error){
      next(error)
    }
  })

  router.post('/sign-provider', validationHandler(createProviderUserSchema), async function(req, res, next) {
    const { body } = req

    const { apiKeyToken , ...user} = body

    if(!apiKeyToken) {
      next(boom.unauthorized('apiKeyToken is required'))
    }
    try {
      const queryUser = await userService.getOrCreateUser({ user })
      const apiKey = await apiKeysService.getApiKey({ token: apiKeyToken })

      if(!apiKey) {
        next(boom.unauthorized())
      }

      const {_id: id, name, email } = queryUser

      const payload = {
        sub: id,
        email,
        name,
        scopes: apiKey.scope
      }

      const token = jwt.sign(payload, config.authJwtSecret, {
        expiresIn: '15m'
      })

      res.status(200).json({token, user: {id, name, email }})
    }
    catch(error){
      next(error)
    }
  })
}

module.exports = authApi