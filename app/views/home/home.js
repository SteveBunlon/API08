angular.module('polarApplication.home', ["ui.router"])

.config(function ($stateProvider){
    
    $stateProvider
    .state('app.home', {
        url: "/home",            
        templateUrl: "views/home/home.html",
        controller: "homeCtrl",      
    });
})

.controller("homeCtrl",["$scope","$state", function ($scope, $state){    
    
}])
