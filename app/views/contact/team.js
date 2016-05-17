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

    .controller("teamCtrl",["usersService","$scope","$state", function (usersService,$scope, $state){
        usersService.getAll().then(function($dataObject){
            console.log('users');
            console.log(JSON.parse($dataObject.data))
;            $scope.users = JSON.parse($dataObject.data);
        }, function($dataObject){
            console.log("no users");
        });
    }])
