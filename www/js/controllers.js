angular.module('starter.controllers', [])

.controller('MainCtrl', function($scope, $state, Selector, Uploader) {
    
    $scope.uploadEnabled = false;
    $scope.showEnabled = false;

    var base64;

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
            $scope.imgurURL = value;
            $scope.showEnabled = true; 
        })
        .catch(function(reason){

        });
    };

    $scope.showResult = function() {
        $state.go('tab.config',{
            url : $scope.imgurURL
        });
    };
})

.controller('ConfigCtrl', function($scope, $stateParams, Search) {

    var url = $stateParams.url;
    
    Search.getData('http://i.imgur.com/MGccnVY.png')//'http://i.imgur.com/MGccnVY.png'
    .then(function(data){
        console.log(JSON.stringify(data));
        //$scope.images = data;  
    })
    .catch(function(reason){
        console.log(JSON.stringify(reason));
    });

});

       






