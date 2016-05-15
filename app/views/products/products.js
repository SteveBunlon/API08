angular.module('polarApplication.products', ["ui.router"])

.config(function ($stateProvider){
    
    $stateProvider
    .state('app.products', {
        url: "/products",
        params: {
          'productsCategory' : ''
        },
        templateUrl: "views/products/products.html",
        controller: "productsCtrl",
    });
})

.controller("productsCtrl",["$scope","$state","$http","$timeout", function ($scope, $state, $http, $timeout){
    $timeout(function() {
        angular.element(document).ready(function () {
            $('ul.tabs').tabs('select_tab', stateParams.productsCategory);
        });
    })
}])
