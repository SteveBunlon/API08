angular.module('polarApplication.home', ["ui.router"])

.config(function ($stateProvider){
    
    $stateProvider
    .state('app.home', {
        url: "/home",            
        templateUrl: "views/home/home.html",
        controller: "homeCtrl",      
    });
})

.directive("contenteditable","$sanitize", function($sanitize) {
    return {
        restrict: "A",
        require: "ngModel",
        link: function(scope, element, attrs, ngModel) {

            function read() {
                ngModel.$setViewValue(element.html());
            }

            ngModel.$render = function() {
                element.html($sanitize(ngModel.$viewValue || ""));
            };

            element.bind("blur keyup change", function() {
                scope.$apply(read);
            });
        }
    };
})
.controller("homeCtrl",["$scope","$state", function ($scope, $state){    
    
}])
