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

    .controller("contactCtrl",["mailService","$scope","$state", function (mailService,$scope, $state){
        console.log($scope.user);
        $scope.sendMail = function(){
            mailService.contactMail($scope.mail, $scope.subject, $scope.text).then(function($dataObject){
                $scope.mail = $scope.subject = $scope.text = "";
                alert("Votre mail a été envoyé avec success");
            }, function($dataObject){
                console.log($dataObject.data);
                alert("Votre mail n'a pas été envoyé, veuillez réessayé ultérieuement");
            })
        };
    }])
