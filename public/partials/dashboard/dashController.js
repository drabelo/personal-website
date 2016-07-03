app.controller('DashCtrl', ['$scope', '$http', '$localStorage', '$rootScope', '$location', function($scope, $http, $localStorage, $rootScope, $location) {
    var config = {
        headers: {
            'Authorization': $localStorage.token
        }
    };

    console.log("Getting account info")
    try{

        $scope.userId = $rootScope.person.username;
        $scope.userRole = $rootScope.person.role;
        $scope.token = $localStorage.token;
        console.log("Got info from session")

    }catch(err){
        console.log("Requesting info from server")
        $http.get("/api/getaccount", config).then(function successCallback(response) {

            $scope.token = $localStorage.token;
            $scope.userId = response.data.email;
            $scope.userRole = response.data.role;
            //save person
            $rootScope.person = {
                "username": response.data.email,
                "role": response.data.role
            };


        }, function errorCallback(response) {
            console.log("Failed getting account")
        });
    }


    $scope.logout = function() {
        $rootScope.loggedInUser = null;
        $rootScope.$broadcast('turnOffDashboard');
        $rootScope.$broadcast('turnOnLogin');

    };
}]);
