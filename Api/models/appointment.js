const { Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define('Appointment', {
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pendente',
    },
  });

  Appointment.associate = (models) => {
    Appointment.belongsTo(models.User, { as: 'Doctor', foreignKey: 'doctorId' });
    Appointment.belongsTo(models.User, { as: 'Patient', foreignKey: 'patientId' });
  };

  return Appointment;
};
