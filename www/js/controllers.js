

angular.module('starter.controllers', [])


.controller('MainCtrl', function($scope, $ionicPlatform, $cordovaImagePicker) {

    $scope.imageURI = 'empty URI';  //es para tener la URI a mano

    $ionicPlatform.ready(function() {
 

        $scope.selectImage = function() {
       
            var options = {
                maximumImagesCount: 1, 
                width: 800,
                height: 800,
                quality: 80           
            };
       
            $cordovaImagePicker.getPictures(options).then(
                function (results) {

                    $scope.imageURI = results[0];

                    convertToBase64(results[0],function(base64Image){
                      alert(base64Image); 
                    });
                }, 
                function(error) {
                }
            );
  
        }; 

    });

      
 

});

/**
 * Convierte la imagen dada por la URI a base64 
 *
 * @path string
 * @callback function se le pasa el contenido de la imagen como primer parametro
 */
function convertToBase64(path,callback){
    window.resolveLocalFileSystemURL(path, gotFile, fail);
            
    function fail(e) {
          alert('File not found');
    }

    function gotFile(fileEntry) {
           fileEntry.file(function(file) {
              var reader = new FileReader();
              reader.onloadend = function(e) {
                   var content = this.result;
                   callback(content);
              };
              // Tmetodo readAsDatURL Method del file-plugin
              reader.readAsDataURL(file);
           });
    }
}
