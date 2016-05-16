/**
 * Created by samuel on 16/05/16.
 */
angular.module('polarApplication.annalsUpload', ["ui.router"])

    .config(function ($stateProvider){

        $stateProvider
            .state('app.annalsUpload', {
                url: "/annals/upload",
                templateUrl: "views/annals/annalsUpload.html",
                controller: "annalsUploadCtrl"
            });
    })

    .controller("annalsUploadCtrl",["$scope","$state", function ($scope, $state){
    }]);

