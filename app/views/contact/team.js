/**
 * Created by samuel on 16/05/16.
 */
angular.module('polarApplication.team', ["ui.router"])

    .config(function ($stateProvider){

        $stateProvider
            .state('app.team', {
                url: "/team",
                templateUrl: "views/contact/team.html",
                controller: "teamCtrl",
            });
    })

    .controller("teamCtrl",["$scope","$state", function ($scope, $state){

    }])
