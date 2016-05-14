/**
 * Created by samuel on 14/05/16.
 */
angular.module('polarApplication.commands', ["ui.router"])

    .config(function ($stateProvider){

        $stateProvider
            .state('app.commands', {
                url: "/commands",
                templateUrl: "views/commands/commands.html",
                controller: "commandsCtrl",
            });
    })

    .controller("commandsCtrl",["$scope","$state","$http", function ($scope, $state, $http){

    }])
