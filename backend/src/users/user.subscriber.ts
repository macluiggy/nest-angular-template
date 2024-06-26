import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { validateOrReject } from 'class-validator';
import { UserEntity } from './users.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  listenTo() {
    return UserEntity;
  }

  async beforeInsert(event: InsertEvent<UserEntity>) {
    await validateOrReject(event.entity);
  }

  async beforeUpdate(event: UpdateEvent<UserEntity>) {
    await validateOrReject(event.entity);
  }
}
