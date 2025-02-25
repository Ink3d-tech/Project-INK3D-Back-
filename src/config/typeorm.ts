import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: './.env.development' });

const config = {
  type: 'postgres',
  host: `${process.env.DB_HOST}`,
  port: parseInt(`${process.env.DB_PORT}`, 10),  // Asegúrate de convertir a número
  username: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/**/*.migrations{js,ts}'],
  autoLoadEntities: true,
  dropSchema: true,
  synchronize: true,
  logging: true,
  ssl: {
    rejectUnauthorized: false, 
  },
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
