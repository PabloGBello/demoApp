angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('Search', function($http) {
    
  // Basic Google URL + Image Search Query
  var url = "https://www.google.com/search?tbm=isch";
    
  //Result - Array of Images  
  var postResult = [];
  
  //Retrieve raw data from Google Image Search    
  function getImageData(imageURL){
    var site = url+"&q="+imageURL+"&site=imghp";
    return $http.get(site)
        .then(function(response){
            return Parse(response.data);
        });
  }  

  //Multi parse extraction
  function Parse(Data){
    var start = findStart(Data, 0);
    var result = [];
    console.log(start); 
    while(start != -1){
      var end = Data.indexOf("</a>", start);
      var sub = Data.substring(start, end + 4);
      var aStart = sub.indexOf("?") + 1;
      result.push(sub);
      start = findStart(Data, end + 4);
    }
    return result;
  }
  

  //Retrieve the start position 
  function findStart(line,end){
    var start = line.indexOf("<a", end);
    if (start < 0) {
      return start;
    }
    var e = line.indexOf("</a>", start); 
    if (e < 0) {
      return e;
    }
    var c = line.indexOf("class", start);
    var r = line.indexOf("rg_l", start);
    if (c <= 0 || r <= 0) {
      return -1;
    }
    if (c >= e || r >= e) {
        return findStart(line, e + 4);
    }
    return start; 
  }

  //Main function
  return {
    getData: function(imageURL) {
        return getImageData(imageURL);
    }
  };
});

