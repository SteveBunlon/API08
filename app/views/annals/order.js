/**
 * Created by samuel on 16/05/16.
 */
angular.module('polarApplication.annalsOrder', ["ui.router"])

    .config(function ($stateProvider){

        $stateProvider
            .state('app.annalsOrder', {
                url: "/annals/order",
                templateUrl: "views/annals/annalsOrder.html",
                controller: "annalsOrderCtrl"
            });
    })

    .controller("annalsOrderCtrl",["$scope","$state", function ($scope, $state){
    }]);

