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

.controller("productsCtrl",["$scope","$state","$http", function ($scope, $state, $http){
    $scope.productsCategory = $state.productsCategory;
    $(document).ready(function(){
        $('ul.tabs').tabs('select_tab', $scope.productsCategory);
    });

}])
