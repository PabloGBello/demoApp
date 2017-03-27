angular.module('starter.services', [])

.factory('Selector', function($cordovaImagePicker) {

    function getURI(){

        /*
            Config para elegir las imagenes
            No esta en constants
        */
        var options = {
              maximumImagesCount: 1, 
              width: 800,
              height: 800,
              quality: 80           
        };

        return $cordovaImagePicker.getPictures(options)
          .then(
              function (results) {
                return results[0];    
              },
              function(error){
                return JSON.stringify(error);            
          });       
    }

  return {
      selectImage: function(){
          return getURI();
      }
  };
})

.factory('Uploader', function($http, uploadSettings) {

    function upload(URI){
        convertToBase64(URI, getImgurLink);
    }

    /*
    *  Convierte el archivo dado por la URI a base64 y posteriormente llama al callback registrado con el resultado 
    */
    function convertToBase64(path, callback){

        /* 
        *  Paso el path e intento traer el archivo
        *  Success: el archivo (un objeto fileEntry)
        */ 
        window.resolveLocalFileSystemURL(path, success, error);
                
        function success(fileEntry) {

            var readContent = function(file) {

                var reader = new FileReader();

                // El evento onloadend se va a ejecutar donde readAsDataURL se complete
                reader.onloadend = function(e) {
                     var content = this.result;
                     callback(content);
                };
                reader.readAsDataURL(file);
            };

            fileEntry.file(readContent);
        }

        function error(error) {
            callback("ERROR: file not found");
        }
    }

    /*
    *   Funcion registrada en el callback luego de la conversion a Base64
    *   @content: resultado base64
    *   No retorna, hace un alert: hay que adaptar con código de branch Conf_De_Busq
    */
    var getImgurLink = function(content){

        var headerModel = { Authorization: uploadSettings.apiKey },
            dataModel   = { image: content.split(',')[1] };

        return $http({
            method: uploadSettings.method,
            url:    uploadSettings.url,
            headers: headerModel,
            data:    dataModel
        })
        .then(
            function successCallback(response) {
                alert(response.data.data.link);
            }, 
            function errorCallback(response) {
                alert(JSON.stringify(response));
        });
    };  


  return {
      uploadToImgur: function(URI){
          return upload(URI);
      }
  };
});