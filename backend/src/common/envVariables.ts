// a way to save all the environment variables in one place
// and use them in the app
import * as dotenv from 'dotenv';
import { NODE_ENVIRONMENTS } from './constants';
dotenv.config();

const NODE_ENV = process.env.NODE_ENV || NODE_ENVIRONMENTS.DEVELOPMENT;
const isProduction = NODE_ENV === NODE_ENVIRONMENTS.PRODUCTION;
const isDevelopment = NODE_ENV === NODE_ENVIRONMENTS.DEVELOPMENT;

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT || '5432';
const allDbVariablesSeparatedAreDefined =
  DB_HOST && DB_USER && DB_PASSWORD && DB_NAME && DB_PORT;
const databaseUrl = allDbVariablesSeparatedAreDefined
  ? `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
  : process.env.DATABASE_URL;
const DB_SSL_CERT = process.env.DB_SSL_CA_CERT;

const envVariables = {
  apiVersion: process.env.API_VERSION || 'v1',
  port: process.env.PORT || 3000,
  db: {
    host: DB_HOST || 'db',
    port: parseInt(DB_PORT, 10) || 5432,
    password: DB_PASSWORD || 'postgres',
    databaseName: DB_NAME || 'postgres',
    username: DB_USER || 'postgres',
    databaseUrl,
    ssl: false,
  },
  nodeEnviroment: NODE_ENV,
  isProduction,
  isDevelopment,
  isTesting: NODE_ENV === NODE_ENVIRONMENTS.TEST,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  huggingFaceApiKey: process.env.HUGGINGFACE_API_KEY,
  cloudflare: {
    apiKey: process.env.CLOUDFLARE_API_KEY,
    s3AccessKeyId: process.env.CLOUDFLARE_S3_ACCESS_KEY_ID,
    s3SecretAccessKey: process.env.CLOUDFLARE_S3_SECRET_ACCESS_KEY,
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    s3BucketName: process.env.CLOUDFLARE_S3_BUCKET_NAME,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || 'sdsdsdsdds',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dsdsds',
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'sddsdsds',
  },
  frontedUrl: process.env.FRONTEND_URL,
};

if (DB_SSL_CERT) {
  Object.assign(envVariables.db, {
    ssl: {
      rejectUnauthorized: false,
      ca: DB_SSL_CERT,
    },
  });
}

export default envVariables;
