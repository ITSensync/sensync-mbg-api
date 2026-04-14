import { Sequelize } from "sequelize";

import { env } from "../env.js";

const sequelizeLogging = env.DB_LOGGING
  ? message => console.warn(message)
  : false;

export const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: "mysql",
  logging: sequelizeLogging,
});

export async function connectDatabase() {
  await sequelize.authenticate();

  /* eslint-disable no-console */
  console.log(`Database connected: mysql://${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`);
  /* eslint-enable no-console */
}
