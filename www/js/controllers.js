

var controllerModule = angular.module('theApp.controllers', []);


controllerModule.controller('MainTabController', function($scope, $ionicPlatform, $ionicLoading, $http, $cordovaCamera, $timeout) {

    var accountId = '26c2f281431807b';
    var accountName = 'p767d692';

    $scope.url = 'https://api.imgur.com/oauth2/authorize?response_type=token&client_id=' + accountId; 
    $scope.imageData = getGokuBase64();
     

    $ionicPlatform.ready(function() {

        
        var extractToken = function(hash) {
          var match = hash.match(/access_token=(\w+)/);
          return !!match && match[1];
        };
 
        var $post = $('.post');
        var $img = $('img');
 
        $post.click(function() {
          localStorage.doUpload = true;
          localStorage.imageBase64 = $scope.imageData.replace(/.*,/, '');
        });
 
        var token = extractToken(document.location.hash);
        if (token && JSON.parse(localStorage.doUpload)) {
          localStorage.doUpload = false;
          $post.hide();
 
          $.ajax({
            url: 'https://api.imgur.com/3/image',
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + token,
              Accept: 'application/json'
            },
            data: {
              image: localStorage.imageBase64,
              type: 'base64'
            },
            success: function(result) {
              var id = result.data.id;
              window.location = 'https://imgur.com/gallery/' + id;
            }
          });
        }
          
        

        /*$scope.chooseImage = function() {

          var options = {
              a: 5,
              b: 0
          };

          selectPicture(options,
              function(success){
                  $scope.state = 'success';
                  $scope.show = true;
                  $scope.imageData = getGokuBase64();
              },
              function(error){
                  $scope.state = 'error';
              }
            );   

        }; */

        $scope.uploadImage = function() {  


          /*$ionicLoading.show({template: "Uploading..."});

          // CLARAMENTE ESTO NO VA ACÁ... ES POR AHORA. ES EL ID DE LA CUENTA DE IMGUR
          

          

          

          $http.post(url)
              .then(
                    function(response){

                        var request = {
                            method: 'POST',
                            url: 'https://api.imgur.com/3/image',
                            headers: {
                                Authorization: 'Bearer ' + response,
                                Accept: 'application/json'
                            },
                            data: {
                              image: $scope.imageData,
                              type: 'base64'
                            }
                        };
                        
                        $http(request)
                            .then(
                                function(result){
                                    var id = result.data.id;
                                    window.location = 'https://imgur.com/gallery/' + id;
                                }, 
                                function(error){

                                }
                            );                
                    }
              );

          $timeout(function(){$ionicLoading.hide()}, 1000);*/

        
        }; 


      // elegir la foto
        // $scope.subifoto = true
        // ahi se habilita el boton de upload to imgur
          //loguear a imgur
            //upload de la foto

    }); 


  // PROBANDO EN BROWSER SIN PLUGINS MOBILE
  // LUEGO SE REEMPLAZA POR EL CORDOVACAMERA
  function selectPicture(options, successCallback, errorCallback){
      if (1){
        successCallback('success');
      }
      else{
        errorCallback('error');
      }
  }


        
 

  // AUTENTICAR CON CUENTA IMGUR
  function loginToImgur(accountId){
      $cordovaOauth.imgur(accountId).then(
          function(result) {
              console.log(JSON.stringify(result));
              result.expires_at = (new Date).getTime() + (result.expires_in * 1000);
              $localStorage.imgur = {
                  oauth: result
              };
              imgurInstance = new $imgur(result.access_token);
          }, 
          function(error) {
              console.log(error);
          }
      );
  }

  function getGokuBase64(){
    return 'data:image/jpeg;base64,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';
  }

});
