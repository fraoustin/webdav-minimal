console.log("webdav-auth")

function encodeData(data) {
  return Object.keys(data).map(function(key) {
      return [key, data[key]].map(encodeURIComponent).join("=");
  }).join("&");
}

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
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
  urllogin = url.substring(0, url.indexOf('/auth'))
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
    if(!document.getElementById("nameFile").files.item(0).name == false){
      fs.file(document.getElementById("nameFile").files.item(0).name).write(event.target.result);
      location.reload();
    } else {
      console.log("nameFile is null")
    }
  };
  reader.readAsArrayBuffer(document.getElementById("nameFile").files[0]);
}

function mkdir(dirName){
  var url = window.location.protocol + '//' + window.location.host+window.location.pathname;
  var fs = new WebDAV.Fs(url);
  var dirName = prompt("Please enter name of new direction", "NewDir");
  if (!dirName == false){
    fs.dir(dirName+"/").mkdir();
    location.reload();
  } else {
    console.log("dirName is null")
  };   
}

function FileConvertSize(aSize){
	aSize = Math.abs(parseInt(aSize, 10));
	var def = [[1, 'o'], [1024, 'ko'], [1024*1024, 'Mo'], [1024*1024*1024, 'Go'], [1024*1024*1024*1024, 'To']];
	for(var i=0; i<def.length; i++){
		if(aSize<def[i][0]) return (aSize/def[i-1][0]).toFixed(0)+' '+def[i-1][1];
	}
}

function bin(name){
  var url = window.location.protocol + '//' + window.location.host+window.location.pathname;
  var fs = new WebDAV.Fs(url);
  if (name == undefined){
    var name = prompt("Please enter name of element for delete", "Name");
  }
  document.querySelectorAll("td.dir a").forEach(elt => {
    if (elt.innerText == name) {
      console.log("del dir " + name)
      fs.dir(name).rm()
    }
  })
  document.querySelectorAll("td.file a").forEach(elt => {
    if (elt.innerText == name) {
      console.log("del file " + name)
      fs.file(name).rm()
    }
  })
  location.reload()
}

/* load page */
document.querySelectorAll('#list tbody tr').forEach(elt => {
  if (elt.querySelectorAll("td")[1].innerText == '-') {
    elt.querySelectorAll("td")[0].getElementsByTagName("a")[0].innerText = elt.querySelectorAll("td")[0].getElementsByTagName("a")[0].innerText.replace("/","")
    if (elt.querySelectorAll("td")[0].getElementsByTagName("a")[0].innerText == "Parent directory") {
      elt.querySelectorAll("td")[0].classList.add("parent")
    } else {
     elt.querySelectorAll("td")[0].classList.add("dir")
    }
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
document.getElementById("list").querySelectorAll("a").forEach(elt => {
  elt.removeAttribute("title")
})

document.getElementById("list").querySelectorAll("tbody tr td:nth-child(2)").forEach(elt => {
  if (elt.innerText != '-') {
    elt.innerText = FileConvertSize(elt.innerText)
  }
})

document.getElementById("list").querySelectorAll("tbody tr").forEach(elt => {
  elt.append(htmlToElement('<td class="bin"><a class="icon-bin" onclick="bin(\'' + elt.querySelectorAll("td a")[0].innerText + '\'); return false;"></a></td>'))
})
