import 'dotenv/config';
class EnvConfigService {
    constructor(
        private env: { [k: string]: string | undefined }
    ){}

    private getValue(key: string, throwOnMissing = true): string {
        const value = this.env[key];
        if(!value && throwOnMissing)
        {
            throw new Error(`config error - missing env.${key}`);
        }
        return value;
    }

    public getSessionSecret(): string {
        return this.getValue('SESSION_SECRET', true);
    }

    public getCookieDomain(): string {
        if(this.getValue('NODE_ENV') === 'development')
        {
            return 'localhost'
        }
    }
}

const envConfigService = new EnvConfigService(process.env);

export { envConfigService };