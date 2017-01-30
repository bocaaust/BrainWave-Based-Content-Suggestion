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
	if (localStorage.getItem('imgurl') === imgurl) {
		altParse();
		
		//return localStorage.getItem('data');
	}else{
		localStorage.setItem('imgurl', imgurl);
	
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
}

function altParse(){
	//document.getElementById('third').hidden = false;
	var tags = [];
	var resp = JSON.parse(localStorage.getItem('data'));
	 if (resp.status_code === 'OK') {
    var results = resp.results;
    tags = results[0].result.tag.classes;
		 tagCloud(tags);
  } else {
    console.log('Sorry, something is wrong.');
  }
	 document.getElementById('tags').innerHTML = tags.toString().replace(/,/g, ', ');
	var url = 'https://api.gfycat.com/v1test/gfycats/search?search_text=';
	axios.get(url + tags[0].toString() + ',' + tags[2].toString() + ',' + tags[3].toString()  + ',' + tags[Math.floor(3 + (Math.random()*6))].toString()).then(function(r) {
		//console.log(r.data.gfycats[Math.floor((Math.random() * 10))]);
		if (r.data.gfycats.length > 0){
		document.getElementById('suggested').src = r.data.gfycats[Math.floor((Math.random() * r.data.gfycats.length))].gifUrl;
	}else{
		document.getElementById('suggested').src = 'https://az853139.vo.msecnd.net/static/images/not-found.png';
	}
		document.getElementById('third').hidden = false;
	}, function(err) {
    console.log('Sorry, something is wrong: ' + err);
  });
  return tags;
}

function parseResponse(resp) {
	//document.getElementById('third').hidden = false;
	localStorage.setItem('data',JSON.stringify(resp));
  var tags = [];
  if (resp.status_code === 'OK') {
    var results = resp.results;
    tags = results[0].result.tag.classes;
	  tagCloud(tags);
  } else {
    console.log('Sorry, something is wrong.');
  }
	
	document.getElementById('second').hidden = false;
	document.getElementById('third').hidden = true;
	//document.getElementById('second').className += "animated zoomIn first";
    document.getElementById('tags').innerHTML = tags.toString().replace(/,/g, ', ');
	//console.log(tags[1].toString());
	var url = 'https://api.gfycat.com/v1test/gfycats/search?search_text=';
	axios.get(url + tags[0].toString() + ',' + tags[2].toString() + ',' + tags[3].toString()  + ',' + tags[Math.floor(3 + (Math.random()*(tags.length-3)))].toString()).then(function(r) {
		//console.log(r.data.gfycats[Math.floor((Math.random() * 10))]);
		if (r.data.gfycats.length > 0){
		document.getElementById('suggested').src = r.data.gfycats[Math.floor((Math.random() * r.data.gfycats.length))].gifUrl;
	}else{
		document.getElementById('suggested').src = 'https://az853139.vo.msecnd.net/static/images/not-found.png';
	}
		document.getElementById('third').hidden = false;
	}, function(err) {
    console.log('Sorry, something is wrong: ' + err);
  });
  return tags;
}

function tagCloud(current){
	if (localStorage.getItem('popularTags') === null){
	
	
		var tags = [];
		var weights = [];
		for(i=0; i < current.length; i++){
			tags[i] = current[i];
			weights[i] = 1;
		}
		
	}else{
		var tags = JSON.parse(localStorage.getItem('popularTags'));
	var weights = JSON.parse(localStorage.getItem('popularWeights'));
		for(i=0; i < current.length; i++){
			var notFound = true;
			for(n=0; n < tags.length; n++){
				if(current[i] === tags[n]){
					notFound = false;
					weights[n]++;
					break;
				}
			}
			if (notFound){
				tags[tags.length] = current[i];
				weights[weights.length] = 1;
			}
		}
	}
	localStorage.setItem('popularTags',JSON.stringify(tags));
	localStorage.setItem('popularWeights',JSON.stringify(weights));
	generateCloud(tags,weights);
	//cloudGif(tags,weights);
}

//function cloudGif(tags,weights){
	
//}

function generateCloud(tags,weights){
	var container = document.getElementById('popular');
	while (container.firstChild) {
    container.removeChild(container.firstChild);
	}
	for (i=0;i<tags.length;i++){
		var item = document.createElement("H4");
		var text = document.createTextNode(tags[i] + ', ');
		item.appendChild(text);
		//item.style.fontSize = (8 + weights[i]) + 'px';
		item.style.display = "inline";
		container.appendChild(item);
	}
}

function reset(){
	localStorage.setItem('popularTags',null);
	localStorage.setItem('popularWeights',null);
	var container = document.getElementById('popular');
	while (container.firstChild) {
    container.removeChild(container.firstChild);
	}
}

function run(imgurl) {
	if (imgurl !== localStorage.getItem('imgurl')){
		document.getElementById('output').hidden = false;
		document.getElementById('cloudSuggestion').hidden = true;
	//document.getElementById('output').className += "animated zoomIn first";
		document.getElementById('second').hidden = true;
	}else{
		document.getElementById('output').hidden = false;
	}
  if (Math.floor(Date.now() / 1000) - localStorage.getItem('tokenTimeStamp') > 86400 || localStorage.getItem('accessToken') === null) {
    getCredentials(function() {
  	postImage(imgurl);
});
  } else {
    postImage(imgurl);
  }
}