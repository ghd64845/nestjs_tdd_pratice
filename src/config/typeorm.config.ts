import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import 'dotenv/config';
class DatabaseConfigService {
    constructor(
        private env: { [k: string]: string | undefined }
    ){}

    private getValue(key: string, throwOnMessing=true): string {
        const value = this.env[key];
        if(!value && throwOnMessing)
        {
            throw new Error(`config error - missing env.${key}`);
        }
        return value;
    }

    public ensureValues(keys: string[]) {
        keys.forEach((k) => this.getValue(k, true));
        return this;
    }

    public getPort() {
        return this.getValue('PORT', true);
    }

    public getTypeOrmConfig(): TypeOrmModuleOptions{
        const dbEndPoint = (this.getValue('NODE_ENV', true) === 'development') ? this.getValue('POSTGRESQL_DEV_DB_URL', true) : this.getValue('POSTGRESQL_DB_URL', true);
        const dbPassword = (this.getValue('NODE_ENV', true) === 'development') ? this.getValue('POSTGRESQL_DEV_DB_PASSWORD', true) : this.getValue('POSTGRESQL_DB_PASSWORD')
        return {
            type: 'postgres',
            host: dbEndPoint,
            port: parseInt(this.getValue('POSTGRESQL_DB_PORT')),
            username: this.getValue('POSTGRESQL_DB_USERNAME'),
            password: dbPassword,
            entities: [
                `${__dirname}/../**/*.entity.ts`,
                `${__dirname}/../**/*.entity.js`
            ],
            migrationsRun: false,
            logging: false,
            migrationsTableName: 'migration',
            migrations: [
                `${__dirname}/migration/**/*.ts`,
                `${__dirname}/migration/**/*.js`
            ],
            synchronize: false,
            cli: {
                migrationsDir: 'src/migration'
            }
        }
    }
}

const databaseConfigService = new DatabaseConfigService(
    process.env
).ensureValues([
  'POSTGRESQL_DEV_DB_URL',
  'POSTGRESQL_DB_PORT',
  'POSTGRESQL_DB_USERNAME',
  'POSTGRESQL_DEV_DB_PASSWORD',
  'POSTGRESQL_DB_NAME',
]);

export {databaseConfigService} 