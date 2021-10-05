export default function gameModel(sequelize, DataTypes) {
  return sequelize.define('game', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    gameState: {
      type: DataTypes.JSON,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
        },
      },
    isCompleted: {
        allowNull: false,
        type: DataTypes.BOOLEAN
      },
    isWon: {
        allowNull: false,
        type: DataTypes.BOOLEAN
      },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }, { underscored: true });
}
