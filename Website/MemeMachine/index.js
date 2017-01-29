function getCredentials(callbackFunction) {
	getGifCredentials();
  var data = {
    'grant_type': 'client_credentials',
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET
  };
  var url = 'https://api.clarifai.com/v1/token';

  return axios.post(url, data, {
    'transformRequest': [
      function() {
        return transformDataToParams(data);
      }
    ]
  }).then(function(r) {
    localStorage.setItem('accessToken', r.data.access_token);
    localStorage.setItem('tokenTimestamp', Math.floor(Date.now() / 1000));
    callbackFunction();
  }, function(err) {
    console.log(err);
  });
}

function getGifCredentials(){
	var data2 = {
    "grant_type":"client_credentials",
    "client_id": gif_client_id,
    "client_secret": gif_client_secret
  };
	var url2 = 'https://api.gfycat.com/v1/oauth/token';
	return axios.post(url2, data2, {
    
  }).then(function(r) {
    localStorage.setItem('gifaccessToken', r.data.access_token);
    
    //callbackFunction();
  }, function(err) {
    console.log(err);
  });
	
}

function transformDataToParams(data) {
  var str = [];
  for (var p in data) {
    if (data.hasOwnProperty(p) && data[p]) {
      if (typeof data[p] === 'string'){
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(data[p]));
      }
      if (typeof data[p] === 'object'){
        for (var i in data[p]) {
          str.push(encodeURIComponent(p) + '=' + encodeURIComponent(data[p][i]));
        }
      }
    }
  }
  return str.join('&');
}

function postImage(imgurl) {
	document.getElementById('originalImage').src = imgurl;
	
  var accessToken = localStorage.getItem('accessToken');
  var data = {
    'url': imgurl
  };
  var url = 'https://api.clarifai.com/v1/tag';
  return axios.post(url, data, {
    'headers': {
      'Authorization': 'Bearer ' + accessToken
    }
  }).then(function(r) {
    parseResponse(r.data);
  }, function(err) {
    console.log('Sorry, something is wrong: ' + err);
  });
}

function parseResponse(resp) {
  var tags = [];
  if (resp.status_code === 'OK') {
    var results = resp.results;
    tags = results[0].result.tag.classes;
  } else {
    console.log('Sorry, something is wrong.');
  }
	document.getElementById('second').hidden = false;
	document.getElementById('third').hidden = true;
	//document.getElementById('second').className += "animated zoomIn first";
    document.getElementById('tags').innerHTML = tags.toString().replace(/,/g, ', ');
	//console.log(tags[1].toString());
	var url = 'https://api.gfycat.com/v1test/gfycats/search?search_text=';
	axios.get(url + tags[0].toString() + ',' + tags[2].toString()  + ',' + tags[3].toString()).then(function(r) {
		console.log(r.data.gfycats[0]);
		document.getElementById('suggested').src = r.data.gfycats[0].gifUrl;
		document.getElementById('third').hidden = false;
	}, function(err) {
    console.log('Sorry, something is wrong: ' + err);
  });
  return tags;
}

function run(imgurl) {
	document.getElementById('output').hidden = false;
	//document.getElementById('output').className += "animated zoomIn first";
	document.getElementById('second').hidden = true;
  if (Math.floor(Date.now() / 1000) - localStorage.getItem('tokenTimeStamp') > 86400 || localStorage.getItem('accessToken') === null) {
    getCredentials(function() {
  postImage(imgurl);
});
  } else {
    postImage(imgurl);
  }
}