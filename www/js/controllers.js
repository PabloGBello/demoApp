angular.module('starter.controllers', [])

.controller('MainCtrl', function($scope, $ionicPlatform, Selector, Uploader) {
    
    $scope.resultURI = '';
    $scope.uploadEnabled = false;

    $scope.selectImage = function() {
        Selector.selectImage()
        .then(function(value){
            $scope.resultURI = value;
            $scope.uploadEnabled = true;
        })
        .catch(function(reason){
        });
    }; 

    $scope.uploadImage = function() {
        Uploader.uploadToImgur($scope.resultURI);
    };
})

.controller('ConfigCtrl', function($scope, Search) {
    Search.getData('http://i.imgur.com/MGccnVY.png')
        .then(function(data){
            $scope.images = data;  
        });
});

       






