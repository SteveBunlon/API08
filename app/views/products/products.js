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
        $scope.products = JSON.parse($dataObject.data);
    }, function($dataObject){
        console.log("no products");
    });

    $scope.editProduct = function(name, price, onSale){
        $scope.name = name;
        $scope.price = price;
        $scope.onSale = onSale;
        $timeout(function() {
            $('#updateProductModal').openModal();
        })
    };


    $scope.createProduct = function(){
        $timeout(function() {
            $('#updateProductModal').openModal();
        })
    }

    $scope.saveProduct = function(){
        productService.saveProduct($scope.name,$scope.price,$scope.onSale).then(function(){
            console.log("saved");
            $state.reload();
        },function(err){
            console.error(err);
        })
    }

    $timeout(function() {
        Materialize.updateTextFields();
        angular.element(document).ready(function () {
            $('ul.tabs').tabs('select_tab', $stateParams.productsCategory);
        });
    })
}])
