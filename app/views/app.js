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
    
}])
