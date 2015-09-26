
export default ngModule => {
  ngModule.directive('postList', () => {
    require('./post-list.css');
    return {
      template: require('./post-list.html'),
      controller: 'MainController'
    };
  });
};
