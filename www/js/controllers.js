angular.module('starter.controllers', [])

.controller('MainCtrl', function($scope, $state, Selector, Uploader) {
    
    $scope.uploadEnabled = false;
    $scope.showEnabled = false;
    //$scope.showEnabled = true;

    var base64;

    $scope.selectImage = function() {
        Selector.selectImage()
        .then(function(value){
            base64 = value;
            $scope.uploadEnabled = true; 
            $scope.showEnabled = false;
        })
        .catch(function(reason){
            $scope.uploadEnabled = false; 
        });
    }; 

    $scope.uploadImage = function() {
        Uploader.uploadToImgur(base64)
        .then(function(value){
            $scope.imgurURL = value;
            $scope.showEnabled = true; 
        })
        .catch(function(reason){
            $scope.showEnabled = false; 
        });
    };

    $scope.showResult = function() {
        $scope.uploadEnabled = false;
        $scope.showEnabled = false;
        $state.go('tab.config',{
            url : $scope.imgurURL 
            //url : 'http://i.imgur.com/MGccnVY.png'
        });
    };
})

.controller('ConfigCtrl', function($scope, $stateParams, Search) {
    $scope.images = [];
    $scope.GoogleText = "";
    var url = $stateParams.url;
    
    Search.getData(url)
    .then(function(response){
        $scope.images = [];
        $scope.GoogleText = response.GoogleText;
        Search.Parse(response.data,$scope.images);
    })
    .catch(function(reason){
        console.log(JSON.stringify(reason));
    })

});