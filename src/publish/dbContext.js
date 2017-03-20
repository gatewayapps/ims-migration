import cls from 'continuation-local-storage'
import Sequelize from 'sequelize'
import Database from '../helpers/database'

const namespace = cls.createNamespace('ims-migration')

export default class DbContext {
  constructor (config) {
    const lConfig = Object.assign({}, config, {
      cls: namespace
    })

    this.context = new Database(lConfig)

    this.Migration = require('./models/migration')(Sequelize, this.context)
    this.MigrationLog = require('./models/migrationsLog')(Sequelize, this.context)
  }

  runRawQuery (queryText) {
    return this.context.query(queryText, { type: Sequelize.QueryTypes.RAW })
  }
}
