/**
 * Created by sbunlon on 17/05/2016.
 */
angular.module('polarApplication.annals', ["ui.router"])

    .config(function ($stateProvider){

        $stateProvider
            .state('app.annals', {
                url: "/annals",
                templateUrl: "views/annals/annals.html",
                controller: "annalsCtrl"
            });
    })

    .controller("annalsCtrl",["commandAnnalService","annalService","$scope","$state", function (commandAnnalService,annalService,$scope, $state){
        annalService.getAll().then(function($dataObject){
            $scope.exists = false;
            $scope.annalsUV = [];
            $scope.annals = JSON.parse($dataObject.data);
            $scope.annalLabels = [];
            $scope.annals.forEach(function(a){
                $scope.annalLabels.forEach(function(a2){
                    if(a2.name === a.name){
                        $scope.exists = true;
                        return;
                    }
                })
                if($scope.exists)
                    $scope.exists = false;
                else
                    $scope.annalLabels.push(a);
            })
        },function($dataObject){
            console.log("annal not got");
        })

        $scope.sendAnnal = function(){
            console.log($scope.annalType, $scope.annalName, $scope.annalFile, $scope.annalSaison, $scope.annalDate);
            if($scope.annalType && $scope.annalName && $scope.annalFile && $scope.annalSaison && $scope.annalDate && $scope.annalPages){
                annalService.add($scope.annalType, $scope.annalName, $scope.annalFile, $scope.annalSaison, $scope.annalDate, $scope.annalPages).then(function(){
                    console.log("file transfered");
                }, function(){
                    alert("Une erreur est survenue !");
                }, function ($dataObject){
                    console.log("transfering files");
                })
                $state.reload();
            }
            else
                false;
        }

        $scope.addFile = function($file, invalidFile, $event){
            if($file && !invalidFile)
                $scope.annalFile = $file;
            else{
                $scope.annaFile = "";
                alert("Votre fichier est invalide !");
            }
        }

        $scope.delete = function($index){
            if($scope.annalsCommand.length != 1)
                $scope.annalsCommand.splice($index, 1);
        }
        $scope.add = function(){
            $scope.annalsCommand.push({name:"", type:"", saison:""})
        }

        $scope.validerCommande = function(){
            $scope.annalsCommand.forEach(function(a){
                a.name = a.name.title;
            })
            commandAnnalService.createCommand($scope.annalsCommand).then(function($dataObjec){
                $state.go("app.commands");
            },function($dataObject){
                alert("Un probleme ets survenu !");
            })
        }

        $scope.typeSelect = ["partiel", "median", "final"];
        $scope.saisonSelect = ["printemps", "automne"];
        $scope.yearSelect = ["2009","2010","2012","2015","2016"];
        $scope.annalsCommand = [{name:"API08", type:"median", saison:"automne",year:"2009"}];
        var currentTime = new Date();
        $scope.currentTime = currentTime;
        $scope.month = ['Januar', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        $scope.monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $scope.weekdaysFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        $scope.weekdaysLetter = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        $scope.disable = [false, 1, 7];
        $scope.today = 'Today';
        $scope.clear = 'Clear';
        $scope.close = 'Close';
        var days = 15;
        $scope.minDate = (new Date($scope.currentTime.getTime() - ( 1000 * 60 * 60 *24 * days ))).toISOString();
        $scope.maxDate = (new Date($scope.currentTime.getTime() + ( 1000 * 60 * 60 *24 * days ))).toISOString();
    }]);
