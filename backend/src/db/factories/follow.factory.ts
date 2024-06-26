import { setSeederFactory } from 'typeorm-extension';
import { FollowEntity } from '../../users/follows/entities/follow.entity';

export default setSeederFactory(FollowEntity, () => {
  const follow = new FollowEntity();
  follow.followingId = 2; // This is a dummy value, you can change it to a valid user id
  follow.followerId = 1; // This is a dummy value, you can change it to a valid user id
  return follow;
});
