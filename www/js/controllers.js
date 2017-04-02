angular.module('starter.controllers', [])

.controller('MainCtrl', function($scope, $ionicPlatform, Selector, Uploader) {
    
    $scope.uploadEnabled = false;
    $scope.showEnabled = false;

    var base64;
    var imgurURL;

    $scope.selectImage = function() {
        Selector.selectImage()
        .then(function(value){
            base64 = value;
            $scope.uploadEnabled = true; 
        })
        .catch(function(reason){

        });
    }; 

    $scope.uploadImage = function() {
        Uploader.uploadToImgur(base64)
        .then(function(value){
            imgurURL = value;
            $scope.showEnabled = true; 
        })
        .catch(function(reason){

        });
    };

    $scope.showResult = function() {
       alert(imgurURL);
    };
})

.controller('ConfigCtrl', function($scope, Search) {
    Search.getData('http://i.imgur.com/MGccnVY.png')
        .then(function(data){
            $scope.images = data;  
        });
});

       






