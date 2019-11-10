console.log("webdav-login")

function encodeData(data) {
  return Object.keys(data).map(function(key) {
      return [key, data[key]].map(encodeURIComponent).join("=");
  }).join("&");
}

function params(param) {
	var vars = {};
	window.location.href.replace( location.hash, '' ).replace( 
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function( m, key, value ) { // callback
			vars[key] = value !== undefined ? decodeURIComponent(value) : '';
		}
	);

	if ( param ) {
		return vars[param] ? vars[param] : null;	
	}
	return vars;
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}

function setLogIn(user, password){
  var xmlhttp = new XMLHttpRequest();
  url = window.location.protocol + '//' + window.location.host+window.location.pathname+ 'auth/'; 
  urlerror = window.location.protocol + '//' + window.location.host+window.location.pathname+ '?error=true'; 
  xmlhttp.open("GET", url.replace(/:\/\//, '://'+user+':'+password+'@'), true);
  xmlhttp.onreadystatechange=function() 
  {
    if(xmlhttp.readyState==4){
      if (xmlhttp.status == 200) {
        window.location.href = url;
      } else {
        window.location.href = urlerror;
      }
    }
  }
  xmlhttp.send();
}

function checkAuth(){
  if (getCookie('webDavLogin') == 'ok') {
    var xmlhttp = new XMLHttpRequest();
    url = window.location.protocol + '//' + window.location.host+window.location.pathname+ 'auth/';
    xmlhttp.open("GET", url, true);
    xmlhttp.onreadystatechange=function() 
    {
      if(xmlhttp.readyState==4){
        if (xmlhttp.status == 200) {
          window.location.href = url;
        }
      }
    }
    xmlhttp.send();
  }
}


/* load page */
var params = params(),
  action = params['error'] ? params['error'] : 'false';
if (action == "true") {
  document.getElementById('error').classList.remove('hidden');
};

var passwordText = document.getElementById("passwordText");
passwordText.addEventListener("keydown", function (e) {
  if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
    if ( document.getElementById('passwordText').value.length > 0 && document.getElementById('userText').value.length > 0) {
      setLogIn(document.getElementById('userText').value, document.getElementById('passwordText').value);
    }
  };
});

checkAuth();
