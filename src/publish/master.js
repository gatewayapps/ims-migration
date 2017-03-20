import { QueryTypes } from 'sequelize'
import Database from '../helpers/database'
import Replacement from '../helpers/Replacement'
import { loadScript } from '../helpers/script'
import {
  Replacements,
  Scripts
} from '../constants'

export function createDatabaseIfNotExists (databaseConfig) {
  const master = new Database(databaseConfig, 'master')
  const replacements = [
    new Replacement(Replacements.DatabaseName, databaseConfig.databaseName)
  ]
  const script = loadScript(Scripts.CreateDatabase, replacements)
  return master.query(script, QueryTypes.RAW)
}
