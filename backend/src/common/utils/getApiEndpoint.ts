import { API_VERSION, NODE_ENVIRONMENTS } from '../constants';
import envVariables from '../envVariables';

const getApiEndpoint = (resource: string) => {
  const api =
    {
      [NODE_ENVIRONMENTS.TEST]: `/api/${API_VERSION}/${resource}`,
    }[envVariables.nodeEnviroment] || `api/${API_VERSION}/${resource}`;
  return api;
};

export default getApiEndpoint;
