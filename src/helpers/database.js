import Sequelize from 'sequelize'
import logger from './logging'

const instances = {}

export default function (config, databaseNameOverride) {
  if (config.cls) {
    Sequelize.cls = config.cls
  }

  let dbName = databaseNameOverride || config.databaseName
  let instanceName

  if (config.instanceName && config.instanceName.toUpperCase() !== 'MSSQLSERVER') {
    instanceName = config.instanceName
  }

  if (!instances[dbName]) {
    const sequelizeConfig = {
      host: config.server,
      dialect: 'mssql',
      dialectOptions: {
        instanceName: instanceName,
        requestTimeout: 300000
      },
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
      options: {
        retry: {
          max: 3
        }
      },
      define: {
        timestamps: false
      },
      logging: config.logging ? logger.status : false
    }

    instances[dbName] = new Sequelize(dbName, config.username, config.password, sequelizeConfig)
  }

  instances[dbName].authenticate()
    .then(() => {
      if (config.logging) {
        logger.status(`${dbName} connected`)
      }
    })

  return instances[dbName]
}
