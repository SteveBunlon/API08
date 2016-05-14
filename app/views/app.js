angular.module('polarApplication', ["polarApplication.services","ui.router", "polarApplication.home",'ui.materialize'])

.config(function ($stateProvider){
    
    $stateProvider
    .state('app', {
        url: "/app",
        abstract:true,            
        templateUrl: "views/app.html",
        controller: "appCtrl",      
    });
})

.constant("API_URL", "http://localhost:3000")

.run(function ($state, $http) {
    $state.go("app.home");
 }) 

.controller("appCtrl",["$scope","$state","loginService","AuthenticationService", function ($scope, $state, loginService, AuthenticationService){
    $(".button-collapse").sideNav();
    $scope.state = $state;

    $scope.goProducts = function(){
        $state.go("app.products");
    }

    $scope.connexion = function(){
        if($scope.passwordConnexion && $scope.emailConnexion){
            loginService.login($scope.emailConnexion, $scope.passwordConnexion).then(function($dataObject){
                AuthenticationService.createSession(JSON.parse($dataObject.data.user), $dataObject.data.token);
                $('#connexionModal').closeModal();
                $scope.passwordConnexion = $scope.emailConnexion = "";
                $state.go("app.home")
            }, function($dataObject){
                $scope.errConnexionMessage = "Une erreur s'est produite, veuillez ré-éssayer ou contacter le Polar.";
            })
        }
    }

    $scope.logout = function(){
        alert("hello");
    }
}])
