angular.module('polarApplication', ["polarApplication.services",
    "ui.router",
    "polarApplication.home",
    "polarApplication.products",
    "polarApplication.service",
    "polarApplication.about",
    "polarApplication.commands",
    'ui.materialize'])

.config(function ($stateProvider){
    
    $stateProvider
    .state('app', {
        url: "/app",
        abstract:true,            
        templateUrl: "views/app.html",
        controller: "appCtrl",
        reload: "true"
    });
})

.constant("API_URL", "http://localhost:3000")

.run(function ($state, $http) {
    $state.go("app.home");
 })

.controller("appCtrl",["$window","$scope","$state","loginService","AuthenticationService", function ($window,$scope, $state, loginService, AuthenticationService){
    $scope.connected = AuthenticationService.isLogged();

    $(".button-collapse").sideNav();
    $scope.state = $state;

    $scope.goHome = function(){
        $state.go("app.home");
    }

    $scope.goProducts = function($event){
        typeof event !== "undefined" // true
        $state.go("app.products",{ 'productsCategory' : $event}, {});
    }

    $scope.goServices= function(){
        $state.go("app.service");
    }

    $scope.goAbout = function(){
        $state.go("app.about");
    }

    $scope.goCommands= function(){
        $state.go("app.commands");
    }

    $scope.connexion = function(){
        if($scope.passwordConnexion && $scope.emailConnexion){
            loginService.login($scope.emailConnexion, $scope.passwordConnexion).then(function($dataObject){
                AuthenticationService.createSession(JSON.parse($dataObject.data.user), $dataObject.data.token);
                $('#connexionModal').closeModal();
                $scope.passwordConnexion = $scope.emailConnexion = "";
                $state.reload();
            }, function($dataObject){
                $scope.errConnexionMessage = "Une erreur s'est produite, veuillez ré-éssayer ou contacter le Polar.";
            })
        }
    }

    $scope.logout = function(){
        loginService.logout();
        $state.reload();
    }

    $scope.isLogged = function(){
        AuthenticationService.isLogged();
    }
}])
