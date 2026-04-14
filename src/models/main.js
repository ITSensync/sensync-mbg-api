import { DataTypes } from "sequelize";

import { sequelize } from "../database/sequelize.js";

export const MainReading = sequelize.define("MainReading", {
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
  ph: {
    type: DataTypes.DECIMAL(10, 2),
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
  tableName: "main_tb",
  timestamps: false,
  freezeTableName: true,
});
