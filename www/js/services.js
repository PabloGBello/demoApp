angular.module('starter.services', [])

.factory('Selector', function($cordovaCamera) {

    function getURI(){

        // Config para la el selector de imagenes
        var options = {
            destinationType : Camera.DestinationType.DATA_URL, 
            sourceType : Camera.PictureSourceType.PHOTOLIBRARY, 
            allowEdit : false,
            saveToPhotoAlbum: false
        };

        return $cordovaCamera.getPicture(options)
          .then(
              function(imageData) {
                return "data:image/jpeg;base64," + imageData;
              }, 
              function(error) {
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

    function upload(base64){

        var headerModel = { Authorization: uploadSettings.apiKey },
            dataModel   = { image: base64.split(',')[1] };

        return $http({
            method: uploadSettings.method,
            url:    uploadSettings.url,
            headers: headerModel,
            data:    dataModel
        })
        .then(
            function successCallback(response) {
                return response.data.data.link;
            }, 
            function errorCallback(error) {
                return JSON.stringify(error);
        });
    }


  return {
      uploadToImgur: function(base64){
          return upload(base64);
      }
  };
});




