import { setSeederFactory } from 'typeorm-extension';
import { DEFAULT_LANG } from '../../lang';
import { UserEntity } from '../../users/users.entity';

export default setSeederFactory(UserEntity, (faker) => {
  const user = new UserEntity();
  user.firstName = faker.person.firstName();
  user.lastName = faker.person.lastName();
  user.email = faker.internet.email({
    firstName: user.firstName,
    lastName: user.lastName,
  });
  // add dummy so the dummy users can be easily identified and deleted in database
  user.email = `dummy.${user.email}`; // use something like: select * from users where email like 'dummy.%'; to find all dummy users
  user.password = faker.internet.password();
  user.phone = faker.phone.number();
  user.username = faker.internet.userName({
    firstName: user.firstName,
    lastName: user.lastName,
  });
  user.preferredLanguage = DEFAULT_LANG;

  return user;
});
