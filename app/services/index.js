export default ngModule => {
  require('./redditService')(ngModule);
  require('./postService')(ngModule);
  require('./userService')(ngModule);
};
