import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { SeederEntity } from '../seeders.entity';
import { UserEntity } from '../../users/users.entity';
import * as bcrypt from 'bcrypt';
import { DEFAULT_LANG } from '../../lang';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    console.log('holaaaa');

    const seederRepository = dataSource.getRepository(SeederEntity);
    const seederName = 'UserSeeder';

    const seeder = await seederRepository.findOne({
      where: { name: seederName },
    });

    if (seeder && seeder.executed) {
      console.log(`Seeder "${seederName}" already executed. Skipping...`);
      return;
    }

    const repository = dataSource.getRepository(UserEntity);
    await repository.insert([
      {
        fullName: 'luiggy macias',
        email: 'ferrinluiggy@gmail.com',
        password: await bcrypt.hash('123456', 10),
        phone: '123456789',
        createdAt: new Date(),
        updatedAt: new Date(),
        username: 'macluiggy',
        preferredLanguage: DEFAULT_LANG,
      },
    ]);

    // ---------------------------------------------------

    const userFactory = factoryManager.get(UserEntity);
    userFactory.setMeta({
      preferredLanguage: DEFAULT_LANG,
    });
    // save 1 factory generated entity, to the database
    await userFactory.save({
      preferredLanguage: DEFAULT_LANG,
    });

    // save 5 factory generated entities, to the database
    await userFactory.saveMany(5, {
      preferredLanguage: DEFAULT_LANG,
    });

    if (seeder) {
      seeder.executed = true;
    } else {
      const newSeeder = new SeederEntity();
      newSeeder.name = seederName;
      newSeeder.executed = true;
      await seederRepository.save(newSeeder);
    }

    console.log(`Seeder "${seederName}" executed successfully.`);
  }
}
