app.controller('LoginCtrl', ['$scope', '$http', '$localStorage', '$rootScope', '$location', function($scope, $http, $localStorage, $rootScope, $location) {
    $scope.user = {};

    $rootScope.$broadcast('turnOffDashboard');
    $rootScope.$broadcast('turnOnLogin');

    $scope.login = function() {

        var headers = {
            username: $scope.user.email,
            password: $scope.user.password,
        };

        $http.post('/api/authenticate', undefined, {
            headers: headers
        }).success(function(data, status, headers, config) {
            $localStorage.token = data.token
                //on success, try to authenticate into dashboard
            $http.get("/api/login", {
                headers: {
                    'Authorization': $localStorage.token
                }
            }).then(function successCallback(response) {
                console.log("User is now logged in");
                $rootScope.loggedInUser = $scope.user.email;
                $rootScope.$broadcast('turnOnDashboard');
                $rootScope.$broadcast('turnOffLogin');
                $rootScope.$broadcast('turnOnLogout');
                $location.path("/dashboard");
            }, function errorCallback(response) {
                console.log("Failed")
            });
        });
    };
}]);
