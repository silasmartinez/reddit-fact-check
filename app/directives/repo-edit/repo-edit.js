/**
 * Created by silasmartinez on 8/3/15.
 */

export default ngModule => {
  ngModule.directive('repoEdit', () => {
    require('./repo-edit.css');
    return {
      restrict: 'E',
      template: require('./repo-edit.html')
    };
  });
};
