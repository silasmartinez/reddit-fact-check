export default ngModule => {
  require('./mainController')(ngModule);
  require('./postController')(ngModule);
  require('./redditListController')(ngModule);
  require('./profileController')(ngModule);
};
