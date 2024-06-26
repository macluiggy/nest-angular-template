import followFactory from '../factories/follow.factory';
import likeFactory from '../factories/like.factory';
import postCommentFactory from '../factories/post-comment.factory';
import postsFactory from '../factories/posts.factory';
import userFactory from '../factories/user.factory';

const factories = [
  userFactory,
  postsFactory,
  followFactory,
  likeFactory,
  postCommentFactory,
];

export default factories;
