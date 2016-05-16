/**
 * Created by samuel on 16/05/16.
 */
angular.module('polarApplication.contact', ["ui.router"])

    .config(function ($stateProvider){

        $stateProvider
            .state('app.contact', {
                url: "/contact",
                templateUrl: "views/contact/contact.html",
                controller: "contactCtrl",
            });
    })

    .controller("contactCtrl",["$scope","$state", function ($scope, $state){

    }])
