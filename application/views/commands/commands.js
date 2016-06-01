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

    .controller("commandsCtrl",["userCommands","$scope","$state","$http", function (userCommands,$scope, $state, $http){
        $scope.annalesUserCommandes = [];
        userCommands.get().then(function($dataObject){
            $scope.userCommands = $dataObject.data;
            $scope.userCommands.forEach(function(c){
                if(c.type === "annales")
                    $scope.annalesUserCommandes.push(c);
            })

            console.log($scope.annalesUserCommandes[0].p);
        },function($dataObject){
            console.log("err whule loading user commands");
        })

    }])
