module.exports = (DataTypes, context) => {
  return context.define('migration', {
    migration: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      primaryKey: true
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: '__Migrations'
  })
}
