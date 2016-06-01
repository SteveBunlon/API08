angular.module('polarApplication', ["polarApplication.services",
    "ui.router",
    "polarApplication.home",
    "polarApplication.products",
    "polarApplication.service",
    "polarApplication.about",
    "polarApplication.contact",
    "polarApplication.annalsList",
    "polarApplication.annalsUpload",
    "polarApplication.annalsOrder",
    "polarApplication.team",
    "polarApplication.commands",
    'ui.materialize',
    'polarApplication.users',
    'polarApplication.annals',
    'angucomplete'])

.config(function ($stateProvider, $locationProvider, $urlRouterProvider){
    
    $stateProvider
    .state('app', {
        url: "",
        abstract:true,            
        templateUrl: "views/app.html",
        controller: "appCtrl",
        reload: "true"
    });

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('app/home');
})

//.constant("API_URL", "http://51.255.169.85:3001")
.constant("API_URL", "http://localhost:3001")

.run(function ($state, $http, loginService, AuthenticationService) {
    //we connect the user if the CAS returned us a student
    if($('#username')[0] && $('#toDisplay')[0] && $('#username')[0].attributes.value &&  $('#toDisplay')[0].attributes.value && $('#username')[0].attributes.value.value &&  $('#toDisplay')[0].attributes.value.value){
        console.log("requested"+$('#username')[0].attributes.value.value);
        loginService.loginFromCas($('#username')[0].attributes.value.value).then(function($dataObject){
            console.log($dataObject);
            AuthenticationService.createSession(JSON.parse($dataObject.data.user), $dataObject.data.token);
            $state.go("app.home");
            return;
        }, function($dataObject){
            console.log($dataObject.data);
        });
    }
    $state.go("app.home");
 })

.controller("appCtrl",["$window","$scope","$state","loginService","AuthenticationService", function ($window,$scope, $state, loginService, AuthenticationService){
    $scope.connected = AuthenticationService.isLogged();

    $scope.commands = function(){
        $state.go('app.commands');
    }

    if($scope.connected)
        $scope.user = AuthenticationService.getUserLogged();

    $(".button-collapse").sideNav();
    $scope.state = $state;

    $scope.goUsers = function(){
        if($scope.user && $scope.user.accountType == "admin")
            $state.go("app.users");
    }

    $scope.goHome = function(){
        $state.go("app.home");
    }

    $scope.goProducts = function($event){
        typeof event !== "undefined" // true
        $state.go("app.products",{ 'productsCategory' : $event}, {});
    }

    $scope.goServices= function(){
        $state.go("app.service");
    }

    $scope.goAnnals = function(){
        $state.go("app.annals");
    }

    $scope.goOrderAnnals = function(){
        $state.go("app.annalsOrder");
    }

    $scope.goUploadAnnals = function(){
        $state.go("app.annalsUpload");
    }


    $scope.goAbout = function(){
        $state.go("app.about");
    }

    $scope.goContact= function(){
        $state.go("app.contact");
    }

    $scope.goTeam= function(){
        $state.go("app.team");
    }

    $scope.goCommands= function(){
        $state.go("app.commands");
    }

    $scope.connexion = function(){
        if($scope.passwordConnexion && $scope.emailConnexion){
            loginService.login($scope.emailConnexion, $scope.passwordConnexion).then(function($dataObject){
                AuthenticationService.createSession(JSON.parse($dataObject.data.user), $dataObject.data.token);
                $('#connexionModal').closeModal();
                $scope.passwordConnexion = $scope.emailConnexion = "";
                $state.go("app.home",{},{reload:true});
            }, function($dataObject){
                $scope.errConnexionMessage = "Une erreur s'est produite, veuillez ré-éssayer ou contacter le Polar.";
            })
        }
    }

    $scope.logout = function(){
        loginService.logout();
        $('.button-collapse').sideNav('hide');
        $state.go("app.home",{},{reload:"true"});
    }

    $scope.isLogged = function(){
        AuthenticationService.isLogged();
    }
}])
