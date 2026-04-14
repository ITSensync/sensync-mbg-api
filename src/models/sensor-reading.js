import { DataTypes } from "sequelize";

import { sequelize } from "../database/sequelize.js";

export const SensorReading = sequelize.define("SensorReading", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  device_id: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  ph: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  sensor_stat: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  cond: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  turbidity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
}, {
  tableName: "mbg_tb",
  timestamps: false,
  freezeTableName: true,
});
