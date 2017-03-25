angular.module('starter.services', [])

.factory('Images', function($cordovaImagePicker, $http) {

    function selectImage(){

        // config para elegir las imagenes
        var options = {
              maximumImagesCount: 1, 
              width: 800,
              height: 800,
              quality: 80           
        };

        // Abre el explorador y espera a que se elija una imagen
        $cordovaImagePicker.getPictures(options)
            .then(
                function (results) {
                  convertToBase64(results[0], uploadToImgur);
            });
    }

    //Convierte la imagen dada por la URI a base64 y la retorna en el callback 
    function convertToBase64(path, callback){
        window.resolveLocalFileSystemURL(path, success, error);
                
        function success(fileEntry) {
            fileEntry.file(function(file) {
                var reader = new FileReader();
                reader.onloadend = function(e) {
                     var content = this.result;
                     callback(content);
                };
                reader.readAsDataURL(file);
            });
        }

        function error(error) {
            alert("ERROR: file not found");
        }
    }

    // la funcion que se va a ejecutar en el callback luego de la conversion a Base64
    var uploadToImgur = function(content){

        var settings = {
              UPLOAD_URL: 'https://api.imgur.com/3/image',
              UPLOAD_METHOD: 'POST',
              API_KEY: 'Client-ID 26c2f281431807b'
        };

        var headerModel = { Authorization: settings.API_KEY },
            dataModel   = { image: content.split(',')[1] };

        $http({
            method: settings.UPLOAD_METHOD,
            url: settings.UPLOAD_URL,
            headers: headerModel,
            data:    dataModel
        })
        .then(
            function successCallback(response) {
                alert(response.data.data.link);
            }, 
            function errorCallback(response) {
        });
    };  

  return {
      uploadSelected: function(){
          return selectImage();
      }
  };
});

