const USER = {
  STORAGE_KEY_PATH: {
    PROFILE_IMAGES(username: string): string {
      return `users/${username}/profile-images`;
    },
  },
};

export default USER;
