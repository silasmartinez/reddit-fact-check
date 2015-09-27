export default ngModule => {
  ngModule.directive('redditList', () => {
    require('./reddit-list.css');
    return {
      restrict: 'E',
      template: require('./reddit-list.html'),
      controller: 'RedditListController'
    };
  });
};
