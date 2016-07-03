var app = angular.module("MyApp", ['ngRoute', 'ngStorage', 'ngIdle']).
config(function($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider.
    when("/index", {
        templateUrl: "partials/home/home.html"
    }).
    when("/login", {
        templateUrl: "partials/login/login.html",
        controller: "LoginCtrl"
    }).
    when("/dashboard", {
        templateUrl: "partials/dashboard/dashboard.html",
        controller: "DashCtrl"
    }).
    when("/logout", {
        templateUrl: "partials/contact/contact.html",
        controller: "LogoutCtrl"
    }).
    otherwise({
        redirectTo: "index.html",
    });
}).
run(function($rootScope, $location) {
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
        // if ($rootScope.loggedInUser == null) {
        //     // no logged user, redirect to /login
        //     if (next.templateUrl === "partials/home/home.html") {
        //
        //     } else {
        //         $location.path("/login");
        //     }
        // } else {
        //
        // }
    });
});

app.controller('EventsCtrl', function($scope, Idle, $location, $rootScope, $localStorage) {
        $scope.events = [];
        Idle.watch();

        $scope.$on('IdleTimeout', function() {
            $rootScope.doTimeout();
        });

        $rootScope.doTimeout = function() {
            Idle.watch();
            $location.path("/logout");
            console.log("Timed out - Logging out");
            Idle.unwatch()
        };

    })
    .config(function(IdleProvider, KeepaliveProvider) {
        IdleProvider.idle(3); // in seconds
        IdleProvider.timeout(5); // in seconds
        KeepaliveProvider.interval(2); // in seconds
    })
    .run(function(Idle) {
        Idle.watch();
    });


app.controller("LogoutCtrl", function($scope, $location, $rootScope, $localStorage) {
    console.log("User is logged out")
    $rootScope.loggedInUser = null;
    $rootScope.person = null;
    delete $localStorage.token;
});
