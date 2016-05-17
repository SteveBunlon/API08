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
    $scope.orig = angular.copy($scope.data);

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
        if($scope.name || $scope.category || $scope.price) {
            productService.createProduct($scope.name,$scope.category,$scope.price,$scope.onSale).then(function(){
                console.log("crated");
                $state.reload();
            },function(err){
                console.error(err);
            });
        }
    };

    $scope.reset = function(){
        $scope.name = '';
        $scope.price = null;
        $scope.onSale = true;
    };

    $scope.saveProduct = function(){
        productService.saveProduct($scope.name,$scope.price,$scope.onSale).then(function(){
            console.log("saved");
            $scope.name = '';
            $scope.price = null;
            $scope.onSale = true;
            $state.reload();
        },function(err){
            console.error(err);
        })
    };

    $scope.toast = function(id){
        console.log("test");
        Materialize.fadeInImage('#'+id);
    };

    $timeout(function() {
        $('.modal-trigger').leanModal({
                ready: function() {  } // Callback for Modal open
            }
        );
        Materialize.updateTextFields();
        angular.element(document).ready(function () {
            $('ul.tabs').tabs('select_tab', $stateParams.productsCategory);
        });
    })
}])
