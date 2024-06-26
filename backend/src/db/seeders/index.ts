import { runSeeders } from 'typeorm-extension';
import datasourceConfig from '../config/datasource.config';

export default datasourceConfig;

(async () => {
  await datasourceConfig.initialize();

  await runSeeders(datasourceConfig, {
    seedName: 'seeds',
  });
})();
