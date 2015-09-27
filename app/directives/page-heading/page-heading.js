export default ngModule => {
  ngModule.directive('pageHeading', () => {
    require('./page-heading.css');
    return {
      restrict: 'E',
      template: require('./page-heading.html'),
      controller: 'ProfileController'
    };
  });
};
