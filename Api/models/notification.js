// models/Notification.js
const {Sequelize} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lida: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
  });

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Notification;
};
