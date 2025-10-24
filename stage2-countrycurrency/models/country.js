import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

export const Country = sequelize.define("Country", {
  name: { type: DataTypes.STRING, allowNull: false },
  capital: DataTypes.STRING,
  region: DataTypes.STRING,
  population: { type: DataTypes.BIGINT, allowNull: false },
  currency_code: { type: DataTypes.STRING, allowNull: true },
  exchange_rate: { type: DataTypes.FLOAT, allowNull: true },
  estimated_gdp: { type: DataTypes.FLOAT, allowNull: true },
  flag_url: DataTypes.STRING,
  last_refreshed_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});
