export default ngModule => {
  ngModule.directive('postView', () => {
    require('./post-view.css');
    return {
      template: require('./post-view.html'),
      controller: 'PostController'
    };
  });
};
