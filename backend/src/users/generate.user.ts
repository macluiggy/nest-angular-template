import { faker } from '@faker-js/faker';
import { UserEntity } from './users.entity';

export default function generateUser(
  userData: UserEntity = {} as UserEntity,
): UserEntity {
  const user = new UserEntity();
  user.firstName = userData.firstName || faker.person.firstName();
  user.lastName = faker.person.lastName();
  user.username =
    userData.username ||
    faker.internet.userName({
      firstName: user.firstName,
      lastName: user.lastName,
    });
  user.email =
    userData.email ||
    faker.internet.email({
      firstName: user.firstName,
      lastName: user.lastName,
    });
  user.password =
    userData.password ||
    faker.internet.password({
      memorable: true,
    });
  user.phone = faker.phone.number();

  return user;
}
