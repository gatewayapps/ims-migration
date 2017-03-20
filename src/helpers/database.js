import Sequelize from 'sequelize'

const instances = {}

export default function (config, databaseNameOverride) {
  if (config.cls) {
    Sequelize.cls = config.cls
  }

  var dbName = databaseNameOverride || config.databaseName

  if (!instances[dbName]) {
    const sequelizeConfig = {
      host: config.server,
      dialect: 'mssql',
      dialectOptions: {
        instanceName: config.instanceName,
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
      logging: config.logging ? console.log : false
    }

    instances[dbName] = new Sequelize(dbName, config.username, config.password, sequelizeConfig)
  }

  instances[dbName].authenticate()
    .then(() => {
      if (config.logging) {
        console.log(`${dbName} connected`)
      }
    })

  return instances[dbName]
}
