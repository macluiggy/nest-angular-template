import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import entities from './entities';
import * as dotenv from 'dotenv';
dotenv.config();
import { SeederOptions } from 'typeorm-extension';
import subscribers from './subscribers';
import envVariables from '../../common/envVariables';
import { DataSource } from 'typeorm';
import migrations from './migrations';
import seeders from './seeders';
import factories from './factories';

const { db } = envVariables;

// detect entity files by ending with .entity.ts .
const typeOrmConfigPostgres: TypeOrmModuleOptions & SeederOptions = {
  type: 'postgres',
  url: db.databaseUrl,
  entities: entities,
  subscribers: subscribers,
  synchronize: false,
  migrations: migrations,
  seeds: seeders,
  factories: factories,
  // run migrations automatically if not in development or testing
  migrationsRun: !envVariables.isDevelopment && !envVariables.isTesting,
  extra: {
    max: 10,
    min: 2,
  },
};
if (envVariables.db.ssl) {
  Object.assign(typeOrmConfigPostgres, { ssl: envVariables.db.ssl });
}
const typeOrmConfigSqlLite: TypeOrmModuleOptions & SeederOptions = {
  type: 'sqlite',
  database: 'database.sqlite',
  entities: entities,
  subscribers: subscribers,
  synchronize: true,
  migrations: migrations,
  seeds: seeders,
  factories: factories,
};

const useSqlLite = true;
const typeOrmConfig = useSqlLite ? typeOrmConfigSqlLite : typeOrmConfigPostgres;
export { typeOrmConfig };

export default new DataSource(typeOrmConfigPostgres as any);
