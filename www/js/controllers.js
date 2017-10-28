angular.module('starter.controllers', [])

.controller('MainCtrl', function($scope, $state, Selector, Uploader) {
    
    $scope.uploadEnabled = false;
    //$scope.showEnabled = false;
    $scope.showEnabled = true;

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
        })
    };

    $scope.showResult = function() {
        $scope.uploadEnabled = false;
        $scope.showEnabled = false;
        $state.go('tab.config',{
           //url : $scope.imgurURL  
            url : 'http://i.imgur.com/MGccnVY.png'
        });
    };
})

.controller('ConfigCtrl', function($scope, $state, $stateParams, Search) {
    $scope.images = [];
    $scope.GoogleText = "";
    var url = $stateParams.url;
    
    if(url){
      Search.getData(url)
        .then(function(response){
            $scope.images = [];
            $scope.GoogleText = response.GoogleText;
            Search.Parse(response.data,$scope.images);
        })
        .catch(function(reason){
            console.log(JSON.stringify(reason));
        }); 
    }

    $scope.showDetail = function(image) {
      $state.go('tab.detail',{
        img : image
      }); 
    }

})


.controller('DetailCtrl', function($scope, $stateParams, $cordovaFileTransfer, $ionicPopup) {
    $scope.image = $stateParams.img;  

    $scope.downloadImage = function(image) {
      var url = $scope.image.imgurl,
        filename = url.split("/").pop()
        targetPath = cordova.file.externalRootDirectory + "/demoApp/" + filename,
        options = {},
        trustHosts = true;

      function alertpopup(status,message) {
        $ionicPopup.alert({
          title: status,
          content: message
        }).then(function(res) {
          console.log('Thank you for not eating my delicious ice cream cone');
        });
      };

      $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
        .then(
          function(result) {
            alertpopup("Success",'Download success');
            //alert('Download success');
            refreshMedia.refresh(targetPath);
          },
          function(err) {
            alertpopup("Error",JSON.stringify(err));
            //alert('Error: ' + JSON.stringify(err));
          },
          function(progress) {
            // progressing download...
          }
        );
    }
})