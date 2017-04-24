angular.module('starter.services', [])

.factory('Selector', function($cordovaCamera) {

    function getImage(){

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
          return getImage();
      }
  };
})

.factory('Uploader', function($http, uploadSettings) {

    function upload(base64){

        var headerModel = { Authorization: uploadSettings.apiKey },
            dataModel   = { image: base64.split(',')[1] };

        return $http({
            method: 'POST',
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

})

.factory('Search', function($http) {

  //Constants
  var Columns = {
     CITE : "cite",
     EI : "ei",
     f21H : "h",
     HL : "hl",
     IMG_REF_URL : "imgrefurl",
     IMG_URL : "imgurl",
     INFO : "info",
     ITY : "ity",
     OS : "os",
     SELECTED : "selected",
     SIMG : "simg",
     SRC : "src",
     START : "start",
     SZ : "sz",
     TBN_H : "tbnh",
     TBN_ID : "tbnid",
     TBN_W : "tbnw",
     TITLE : "title",
     USG : "usg",
     VISIBLE : "visible",
     f22W : "w",
     ZOOM : "zoom"
  };
  
  //AccessibilityNodeInfoCompat constants
  var AccessibilityNodeInfoCompat = {
	 ACTION_DISMISS : 1048576,
	 ACTION_NEXT_HTML_ELEMENT : 1024
  };

  // Basic Google URL + Image Search Query
  const url = "http://www.google.com/";

  //Result - Array of Images  
  var postResult = [];
  
  //Retrieve raw data from Google Image Search    
  function getImageData(imageURL){
    var site = url+"search?tbm=isch&q="+imageURL+"&site=imghp&gws_rd=cr&fg=1";
    //return site;
    return getSearchURL(site)
    	.then(function(resultSite){
        //console.log(resultSite);
    		//return resultSite;
    		return getSimilarImagesURL(resultSite)
    			.then(function(resultSite){
    				//return resultSite;
    				return $http.get(resultSite)
				       .then(function(response){
				       		return response.data;
				       });
		    	}); 
    	});
  }  

  //GET the first url 
  function getSearchURL(site){
  	return $http.get(site)
        .then(function(response){
            return ParseFirstURL(response.data);
        });
  }

  function ParseFirstURL(URLResult){
  	var iIndex = URLResult.lastIndexOf("<a href=\"/searchbyimage?site=imghp&amp;image_url=");
  	var fIndex = URLResult.indexOf("\">",iIndex);
  	return url + URLResult.substring(iIndex + 10,fIndex).replace(/&amp;/g ,'&');
  }

  //GET the second url
  function getSimilarImagesURL(site){
 	return $http.get(site)
        .then(function(response){
            return url + ParseSecondURL(response.data);
        }); 	
  }

  function ParseSecondURL(URLResult){
  	var iIndex = URLResult.indexOf("id=\"imagebox_bigimages");
  	var hrefIndex = URLResult.indexOf("href=\"/search?sa",iIndex);
  	var fIndex = URLResult.indexOf("\">",hrefIndex);

  	return URLResult.substring(hrefIndex + 7,fIndex).replace(/&amp;/g,'&');
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
  
  //Utils function
  function sizeToString(size) {
  	if (size > AccessibilityNodeInfoCompat.ACTION_DISMISS) {
  	  try {
  		  return ((size / AccessibilityNodeInfoCompat.ACTION_NEXT_HTML_ELEMENT) / 1024) + '.2f MB';
  	  } catch (error) {
  		  return null;
  	  }
  	} else if (size > AccessibilityNodeInfoCompat.ACTION_NEXT_HTML_ELEMENT) {
  	  return ((size / 10) / 102) + '.2f KB';
  	} else {
  	  return parseInt(size) + 'd bytes';
  	}
  }
  
  //Ascii2Native function
  function ascii2Native(ascii) {
	if (!ascii) {
		return null;
	}
	var splitUnicodeArray = ascii.split("\\\\u");
	var codePointList = [];
	var extension = null;
	for (var i = 0; i < splitUnicodeArray.length; i++) {
		var target = splitUnicodeArray[i];
		if (i != 0) {
			if (target.length > 4) {
				extension = target.substring(4);
				target = target.substring(0, 4);
			}
			codePointList.push(parseInt(target));
			if (extension) {
				for (var m = 0; m < extension.length; m++) {
					codePointList.push(parseInt(extension.codePointAt(m)));
				}
				extension = null;
			}
		} else if (target) {
			for (var k = 0; k < target.length; k++) {
				codePointList.push(parseInt(target.codePointAt(k)));
			}
		}
	}
	var result = '';
	for (var p = 0; p < codePointList.length; p++) {
		result += String.fromCodePoint(codePointList[p]);
	}
	return result;
  }

  //Main function
  return {
    getData: function(imageURL) {
        return getImageData(imageURL);
    },
    
    //Multi parse extraction
  	Parse: function(SearchResult, result){
		  var start = findStart(SearchResult, 0);
		  var count = 0;
	  	while(start != -1){
	  	  var end = SearchResult.indexOf("</a>", start);
	  	  var sub = SearchResult.substring(start, end + 4);
	  	  var data = {};
	  	  var aStart = sub.indexOf("?") + 1;

	  	  var splitedList = sub.substring(aStart, sub.indexOf("\"", aStart)).split("&amp;");

	  	  for(split in splitedList){
	    		var kvs = split.split("=");
	    		var key = kvs[0];
	    		var value = kvs[1];

				if (key == "?imgurl") {
					data.imgurl = value;
				} else {
					if (key == Columns.IMG_URL) {
						data.imgurl = value;
					} else {
						try {
							if (key == Columns.IMG_REF_URL) {
								data.imgrefurl = value;
							} else {
								if (key == Columns.USG) {
									data.usg = value;
								} else {
									if (key == Columns.f21H) {
										data.f13h = parseInt(value);
									} else {
										if (key == Columns.f22W) {
											data.f14w = parseInt(value);
										} else {
											if (key == Columns.SZ) {
												data.sz = parseInt(value);
											} else {
												if (key == Columns.HL) {
													data.hl = value;
												} else {
													if (key == "?hl") {
														data.hl = value;
													} else {
														if (key == Columns.START) {
															data.start = parseInt(value);
														} else {
															if (key == Columns.ZOOM) {
																data.zoom = parseInt(value);
															} else {
																if (!key == Columns.TBN_ID) {
																	if (key == Columns.TBN_H) {
																		data.tbnh = parseInt(value);
																	} else {
																		if (key == Columns.TBN_W) {
																			data.tbnw = parseInt(value);
																		} else {
																			if (key == Columns.EI) {
																				data.ei = value;
																			} else {
																				if (key == "docid") {
																					data.simg = value;
																				}
																			}
																		}
																	}
																} else if (value && value.endsWith(":")) {
																	data.tbnid = value.substring(0, value.length - 1);
																} else {
																	data.tbnid = value;
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						} catch (error) {
							console.log(error);
						} 
					}
				}  		
	  	  }
		  var srcStart = sub.indexOf("src=\"");
		  data.src = sub.substring(srcStart + 5, sub.indexOf("\"", srcStart + 5));
		  var descStart = SearchResult.indexOf("{", end);
		  var jSONObject = JSON.parse(SearchResult.substring(descStart, SearchResult.indexOf("</div>", descStart)));
		  var is;
		  if ("is" in jSONObject) {
			  is = jSONObject.is;
		  } else {
	  		if ("ow" in jSONObject) {
	  			if ("oh" in jSONObject) {
	  				is = jSONObject.ow + "x" + jSONObject.oh;
	  			}
	  		}
		  }
		  if ("ow" in jSONObject) {
	  		try {
	  			data.f14w = parseInt(jSONObject.ow);
	  		} catch (error) {
	  			console.log(error);
	  		}
		  }
		  if ("oh" in jSONObject) {
			  try {
	  	 		data.f13h = parseInt(jSONObject.oh);
	  		} catch (error) {
	  			console.log(error);
	  		}
		  }
		  data.usg = is;
		  var ity = null;
		  if (Columns.ITY in jSONObject) {
			  ity = jSONObject[Columns.ITY];
		  }
		  data.ity = ity;
		  var os = null;
		  if (Columns.OS in jSONObject) {
			  os = jSONObject[Columns.OS];
		  }
		  try {
	  		if(os){
	  		  data.os = sizeToString(parseInt(os));		
	  		}
		  } catch (error) {
			  console.log(error);
		  }
		  var s;
		  if ("pt" in jSONObject) {
			  s = jSONObject.pt;
		  } else {
	  		if ("s" in jSONObject) {
	  			s = jSONObject.s;
	  		}
		  }
		  if (s) {
			  data.title = ascii2Native(s);
		  }
		  var isu = jSONObject.isu;	  
		  if (isu) {
			  data.cite = ascii2Native(isu);
		  }
		  if ("tu" in jSONObject) {
			  data.src = jSONObject.tu;
		  }
		  if ("th" in jSONObject) {
			  data.tbnh = parseInt(jSONObject.th);
		  }
		  if ("tw" in jSONObject) {
			  data.tbnw = parseInt(jSONObject.tw);
		  }  
		  if ("ou" in jSONObject) {
			  data.imgurl = jSONObject.ou;
		  }
		  if ("ru" in jSONObject) {
			  data.imgrefurl = jSONObject.ru;
		  }
		  result.push(data);
		  count++;
		  if (data.imgurl) {
			 if (!data.imgurl.startsWith("x-raw-image://")) {
				// event.data.add(data);
			 }
		  }
	  	  start = findStart(SearchResult, end + 4);
	  	}
		 return result;
	  }
  };
});