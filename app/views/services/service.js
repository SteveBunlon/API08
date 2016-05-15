/**
 * Created by samuel on 14/05/16.
 */
angular.module('polarApplication.service', ["ui.router"])

    .config(function ($stateProvider){
        $stateProvider
            .state('app.service', {
                url: "/service",
                templateUrl: "views/services/service.html",
                controller: "serviceCtrl",
            });
    })

    .controller("serviceCtrl",["$scope","$state","$http", function ($scope, $state, $http){

        //this.$onInit = function() {
        //};

    }])
