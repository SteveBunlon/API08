/**
 * Created by samuel on 11/05/16.
 */
angular.module('polarApplication.about', ["ui.router"])

    .config(function ($stateProvider){

        $stateProvider
            .state('app.about', {
                url: "/about",
                templateUrl: "views/about/about.html",
                controller: "aboutCtrl"
            });
    })

    .controller("aboutCtrl",["$window","$scope", function ($window,$scope){
        $scope.goBack = function(){
            console.log("hella high");
            $window.history.back();
        }
    }]);
