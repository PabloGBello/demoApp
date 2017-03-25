

angular.module('starter.controllers', [])


.controller('MainCtrl', function($scope, $ionicPlatform, Images) {
    
    $scope.selectImage = function() {
        Images.uploadSelected();
    }; 
    
});

       






