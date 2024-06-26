import USER from './user';

const API_VERSION = 'v1';
const OBJECT = {
  a: 1,
};
const NODE_ENVIRONMENTS = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
  TEST: 'test',
  STAGING: 'staging',
};

const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

const CORS_ORIGINS = [
  'http://localhost:4200',
  'https://social-media-8yq.pages.dev',
  'https://staging-social-media.pages.dev',
  process.env.FRONTEND_URL,
  'https://srng5l6h-4200.use2.devtunnels.ms',
];

function sealAndFreezeObj(...objs) {
  // return Object.freeze(Object.seal(Object.assign({}, ...objs)));
  for (const obj of objs) {
    Object.seal(obj);
    Object.freeze(obj);
  }
}

sealAndFreezeObj(OBJECT, API_VERSION, NODE_ENVIRONMENTS, USER, CORS_ORIGINS);

export {
  API_VERSION,
  OBJECT,
  NODE_ENVIRONMENTS,
  ONE_WEEK_IN_SECONDS,
  USER,
  CORS_ORIGINS,
};
