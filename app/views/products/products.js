angular.module('polarApplication.products', ["ui.router"])

.config(function ($stateProvider){
    
    $stateProvider
    .state('app.products', {
        url: "/products",
        params: {
          'productsCategory' : ''
        },
        templateUrl: "views/products/products.html",
        controller: "productsCtrl"
    });
})

.controller("productsCtrl",["productService","$scope","$state", "$stateParams","$http","$timeout", function (productService,$scope, $state, $stateParams, $http, $timeout){

    productService.getProducts().then(function($dataObject){
        console.log(JSON.parse($dataObject.data));
        $scope.products = JSON.parse($dataObject.data);
    }, function($dataObject){
        console.log("no products");
    });

    $scope.editProduct = function(name, price){
        console.log(name);
        $scope.name = name;
        $scope.price = price;
        $timeout(function() {
            $('#updateProductModal').openModal();
        })
    };

    $timeout(function() {
        Materialize.updateTextFields();
        angular.element(document).ready(function () {
            $('ul.tabs').tabs('select_tab', $stateParams.productsCategory);
        });
    })
}])
