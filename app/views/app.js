angular.module('polarApplication', ["ui.router", "polarApplication.home"])

.config(function ($stateProvider){
    
    $stateProvider
    .state('app', {
        url: "/app",
        abstract:true,            
        templateUrl: "views/app.html",
        controller: "appCtrl",      
    });
})

.run(function ($state) {	
    $state.go("app.home");
 }) 

.controller("appCtrl",["$scope","$state", function ($scope, $state){    
    $(".button-collapse").sideNav();
    $scope.state = $state;
    console.log($state.current);

    $scope.goProducts = function(){
        $state.go("app.products");
    }
}])
