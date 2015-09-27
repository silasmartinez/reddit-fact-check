export default ngModule => {
  ngModule.directive('myHello', () => {
    require('./my-hello.css');
    return {
      restrict: 'E',
      scope: {},
      template: require('./my-hello.html'),
      controllerAs: 'vm',
      controller: function () {
        var vm = this;

        vm.greeting = 'Hello there';
      }
    };
  });
};
