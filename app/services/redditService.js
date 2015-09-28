export default ngModule => {
  ngModule.service('redditService',
    function ($http, $q) {
      // Return public API.
      return ({
        getSubList: getSubList,
        getSubReddit: getSubReddit,
        checkPost: checkPost,
        addSubReddit: addSubReddit,
        deleteSub: deleteSub
      });

      function getSubReddit (sub) {
        var request = $http.get('/api/reddit',{
            params: {
              sub: sub
            }
        });
        return (request.then(handleSuccess, handleError));
      }

      function getSubList () {
        var request = $http.get('/api/reddit/list');
        return (request.then(handleSuccess, handleError));
      }

      function checkPost (post) {
        var request = $http.post('/api/reddit', post);
        return (request.then(handleSuccess, handleError));
      }

      function addSubReddit (sub) {
        var request = $http.post('/api/reddit/list', sub);
        return (request.then(handleSuccess, handleError));
      }

      function deleteSub (sub) {
        var request = $http.delete('/api/reddit/list/' + sub);
        return (request.then(handleSuccess, handleError));
      }

      function handleError (response) {
        if (
          !angular.isObject(response.data) || !response.data.message
        ) {
          return ($q.reject('An unknown error occurred.'));
        }
        return ($q.reject(response.data.message));
      }

      function handleSuccess (response) {
        return (response.data);
      }
    });
};
