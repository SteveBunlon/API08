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
        var testValidity = true;
        if($scope.name && $scope.price && $scope.onSale && $scope.productFile && $scope.category){
            $scope.products.forEach(function(prod){
                if(prod.name == $scope.name){
                    $scope.errMessage = "Le nom de produit éxiste déjà";
                    testValidity = false;
                    return;
                }
            })
            if(testValidity){
                productService.createProduct($scope.category, $scope.name, $scope.price, $scope.onSale, $scope.productFile).then(function(){
                    console.log("file transfered");
                }, function($dataObject){
                    alert($dataObject.data);
                }, function ($dataObject){
                    console.log("transfering files");
                })
                $state.reload();
            }
        }
        else
            false;
    }

    $scope.reset = function(){
        $scope.name = '';
        $scope.price = null;
        $scope.onSale = true;
    };

    $scope.saveProduct = function(){
        productService.saveProduct($scope.name,$scope.price,$scope.onSale).then(function(){
            console.log("saved");
            $state.reload();
        },function(err){
            console.error(err);
        })
    };

    $scope.addFile = function($file, invalidFile, $event){
        if($file && !invalidFile)
            $scope.productFile = $file;
        else{
            $scope.productFile = "";
            alert("Votre fichier est invalide !");
        }
    }

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
