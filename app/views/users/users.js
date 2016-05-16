/**
 * Created by sbunlon on 16/05/2016.
 */
angular.module('polarApplication.users', ["ui.router"])

    .config(function ($stateProvider){

        $stateProvider
            .state('app.users', {
                url: "/users",
                templateUrl: "views/users/users.html",
                controller: "usersCtrl",
            });
    })

    .controller("usersCtrl",["usersService", "$scope","$state", function (usersService, $scope, $state){
        usersService.getAll().then(function($dataObject){
            $scope.users = JSON.parse($dataObject.data);
        },function($dataObject){
            $state.go("app.home");
        });

        $scope.roles = ["user", "membre", "admin"];
        $scope.accountType = $scope.roles[0];
        $scope.createUser = function(){
            if($scope.firstName || $scope.lastName || $scope.mail || $scope.password)
                usersService.new($scope.firstName, $scope.lastName, $scope.mail, $scope.password, $scope.accountType).then(function($dataObject){
                    $("#newUserModal").closeModal();
                    Materialize.toast("Utilisateur créé !", 4000);
                    $scope.mail = $scope.firstName = $scope.lastName = $scope.password = $scope.accountType = "";
                    usersService.getAll().then(function($dataObject){
                        $scope.users = JSON.parse($dataObject.data);
                    },function($dataObject){
                        $state.go("app.home");
                    });
                }, function($dataObject){
                    console.log($dataObject.data);
                    alert("L'utilisateur n'a pas été créé");
                })
        }
    }])
