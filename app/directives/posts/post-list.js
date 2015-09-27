export default ngModule => {
  ngModule.directive('postList', () => {
    require('./post-list.css');
    return {
      template: require('./post-list.html'),
      controller: 'MainController'
    };
  });
  ngModule.filter('sanitize', ['$sce', function ($sce) {
    return function (htmlCode) {
      return $sce.trustAsHtml(htmlCode);
    };
  }]);
};
