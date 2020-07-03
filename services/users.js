const MongoLib = require('../lib/mongo')
const bcrypt = require('bcrypt')

class UserService {
  constructor(){
    this.collection = 'users'
    this.mongoDB = new MongoLib()
  }

  async getUser({ email }) {
    const [ user ] = await this.mongoDB.getAll(this.collection, {email})
    return user
  }

  async createUser({ user }) {
    const { name, email, password } = user
    const hashPassword = await bcrypt.hash(password, 10)

    const createUserId = await this.mongoDB.create(this.collection, {
      name,
      email, 
      password: hashPassword
    })

    return createUserId;
  }

  async getOrCreateUser({ user }){
    const queryUser = await this.getUser({ email: user.email })

    if(queryUser){
      return queryUser
    }

    await this.createUser({ user })

    return await this.getUser({ email: user.email })
  }

}

module.exports = UserService