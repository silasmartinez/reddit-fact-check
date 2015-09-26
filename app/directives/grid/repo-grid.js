
export default ngModule => {
  ngModule.directive('repoGrid', () => {
    require('./repo-grid.css');
    return {
      restrict: 'E',
      template: require('./repo-grid.html')
    };
  });
};
