module.exports = (DataTypes, context) => {
  return context.define('migrationsLog', {
    logId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    message: {
      type: DataTypes.STRING('MAX'),
      allowNull: false
    },
    migration: {
      type: DataTypes.STRING(1000),
      allowNull: true
    }
  }, {
    tableName: '__MigrationsLog'
  })
}
