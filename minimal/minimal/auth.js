console.log("webdav-auth")

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

function logOut(){
  setCookie("webDavLogin","ko")
  var xmlhttp = new XMLHttpRequest();
  url = window.location.protocol + '//' + window.location.host+window.location.pathname;
  urllogin = "http://127.0.0.1:8080/" 
  xmlhttp.open("GET", url.replace(/:\/\//, '://user:nopassword@'), true);
  xmlhttp.onreadystatechange=function() 
  {
    if(xmlhttp.readyState==4){
      window.location.href = urllogin;
    }
  }
  xmlhttp.send();
}

function loadUpload(){
  document.getElementById("nameFile").click();
}

function upload(){
  var url = window.location.protocol + '//' + window.location.host+window.location.pathname;
  var fs = new WebDAV.Fs(url);
  var reader = new FileReader();
  reader.onload = function(event) {
    fs.file(document.getElementById("nameFile").files.item(0).name).write(event.target.result);
    location.reload();
  };
  reader.readAsArrayBuffer(document.getElementById("nameFile").files[0]);
}

function mkdir(){
  var url = window.location.protocol + '//' + window.location.host+window.location.pathname;
  var fs = new WebDAV.Fs(url);
  var dirName = prompt("Please enter name of new direction", "NewDir");
  fs.dir(dirName+"/").mkdir();
  location.reload()
}

function FileConvertSize(aSize){
	aSize = Math.abs(parseInt(aSize, 10));
	var def = [[1, 'o'], [1024, 'ko'], [1024*1024, 'Mo'], [1024*1024*1024, 'Go'], [1024*1024*1024*1024, 'To']];
	for(var i=0; i<def.length; i++){
		if(aSize<def[i][0]) return (aSize/def[i-1][0]).toFixed(0)+' '+def[i-1][1];
	}
}

/* load page */
document.querySelectorAll('#list tbody tr').forEach(elt => {
  if (elt.querySelectorAll("td")[1].innerText == '-') {
    elt.querySelectorAll("td")[0].classList.add("dir")
  }else{
    elt.querySelectorAll("td")[0].classList.add("file")
  }
})

setCookie('webDavLogin','ok')
var params = params(),
  c = params['C'] ? params['C'] : 'N',
  o = params['O'] ? params['O'] : 'A';

query= "?C="+c+"&O="+o
document.getElementById("list").querySelectorAll('th a:nth-child(2)').forEach(elt => {
  elt.remove()
})
document.getElementById("list").querySelectorAll("th a[href='"+query+"']").forEach(elt => {
  if (o == 'A') {
    newquery = "?C="+c+"&O=D"
  } else {
    newquery = "?C="+c+"&O=A"
  }
  elt.href = newquery
})

document.getElementById("list").querySelectorAll("tbody tr td:nth-child(2)").forEach(elt => {
  if (elt.innerText != '-') {
    elt.innerText = FileConvertSize(elt.innerText)
  }
})