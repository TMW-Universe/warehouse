import { Logger } from '@nestjs/common';

const getBooleanFromString = (value: string | undefined, def = false) => {
  if (value === undefined || value === '') return def;

  return ['true', '1', 'yes', 'enabled'].includes(value.toLowerCase());
};

const getNumberFromString = (value: string | undefined, def: number) => {
  if (value === undefined) return def;

  const num = +value;

  if (isNaN(num)) {
    Logger.warn(
      `'${value}' is not a number. It has been defaulted to '${def}'. Please, check the configuration file and set a valid number.`,
    );
    return def;
  }
  return num;
};

const getOptionalString = (value: string | undefined, def: string) => {
  if (!value || value === '') return def;
  return value;
};

export const getEnv = (): EnvFile => {
  const env = process.env as unknown as RawEnvFile;

  return {
    databaseUrl: env.DATABASE_URL,
    configPath: env.CONFIG_PATH,
    rsaKeyBytes: getNumberFromString(env.RSA_KEY_BYTES, 4096),
  };
};

interface EnvFile {
  databaseUrl: string;
  configPath: string;
  rsaKeyBytes: number;
}

class RawEnvFile {
  DATABASE_URL: string;
  CONFIG_PATH: string;
  RSA_KEY_BYTES: string;
}
