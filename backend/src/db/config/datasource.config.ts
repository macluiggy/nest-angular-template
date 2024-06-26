import { DataSource, DataSourceOptions } from 'typeorm';
import { typeOrmConfig } from './typeorm.config';

export const config: any = typeOrmConfig;

export default new DataSource(typeOrmConfig as DataSourceOptions);
