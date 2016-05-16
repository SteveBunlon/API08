/**
 * Created by samuel on 16/05/16.
 */
angular.module('polarApplication.annalsList', ["ui.router"])

    .config(function ($stateProvider){

        $stateProvider
            .state('app.annalsList', {
                url: "/annals/list",
                templateUrl: "views/annals/list.html",
                controller: "annalsListCtrl"
            });
    })

    .controller("annalsListCtrl",["$scope","$state", function ($scope, $state){
    }]);
