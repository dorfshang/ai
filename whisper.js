/**
 * Whisper.js
 * 
 * @author:      Eltrac(BigCoke233)
 * @license:     MIT
 * @Last Update: 2020/4/9
 */

//jQuery
var $ = jQuery;
 
//Debug mode
var whisperDebug;

//Error Report
$('#ld').text('Maybe something went wrong, please check your url.');
 
//Get location query variable
function getQueryVar(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

//If the query is available
function isAvailable(param){
	return (undefined != param && null != param && "" != param && "null" != name);
}

//Things that have to be done after loading
function finishLoad() {
	$('#ld').remove();
	$('#ct').addClass('loaded');
}

//output dialog
(function(){
	if(isAvailable(getQueryVar('t'))){
	  //if TEXT is available
	  var data = Base64.decode(getQueryVar('t'));
	  //Erase error report
	  $('#ld').text('Loading...');
	  var obj = JSON.parse(data);
	  var obj_length = Object.keys(obj).length;
	  //if the debug mode is on
	  if(whisperDebug==true){
	    console.log('RAW DATA: \n'+data);
	    console.log('JS OBJECT: \n' +obj)
	    console.log('DATA LENGTH: \n'+obj_length)
	  }//endif
	  //echo all the dialog
	  $('#ct').prepend('<h1>Dialog</h1><hr>');
	  for(var i in obj){
		$('#ct').append('<div class="wsp-item"><div class"wsp-name">' + obj[i].name + '</div><div class="wsp-content">' + obj[i].text + '</div></div>');
	  }
	  $('#ct').append('<hr><div class="wsp-reply"><input type="text" id="wsp-name" placeholder="Name*" /><br><textarea id="wsp-text" placeholder="Type your whisper."></textarea><br><button id="wsp-reply">Whisper</button><div class="wsp-link" id="wsp-link-output"></div></div>');
	  finishLoad();
	}else{
      //if not
	  finishLoad();
	  //output the textarea and button
	  $('#ct').html('<h1>Whisper</h1><hr><input type="text" id="wsp-name" placeholder="Name*" /><br><textarea id="wsp-text" placeholder="Type your whisper."></textarea><br><button id="wsp-do">Whisper</button><div class="wsp-link" id="wsp-link-output"></div>');
	}
})();

//input dialog
$("#wsp-do").click(function(){
  var wsp_text = $('#wsp-text').val();
  if(wsp_text.length<=0){
	  alert('Please type something to whisper!');
	  return;
  }
  else if($('#wsp-name').length<=0){
	  alert('Please type a name(nickname) to whisper!');
	  return;
  }
  else {
	  var wsp_link = location.href + '?t=' + Base64.encode('[{"name":"'+$('#wsp-name').val()+'","text":"'+wsp_text+'"}]');
	  var shortlink_api = 'https://api.uomg.com/api/long2dwz?dwzapi=tcn&url='+wsp_link;
      $.getJSON(shortlink_api, function(data){ 
	    if(data.code==1 && data.ae_url){
	      wsp_link = data.ae_url;
		}
		else {
		  wsp_link = 'Something went wrong, try refreshing this page or contact the admin.';
		}
	    $('#wsp-link-output').text(wsp_link);
      });
  }
});
$("#wsp-reply").click(function(){
  var wsp_text = $('#wsp-text').val();
  if(wsp_text.length<=0){
	  alert('Please type something to reply!');
	  return;
  }
  else if($('#wsp-name').length<=0){
	  alert('Please type a name(nickname) to reply!');
	  return;
  }
  else {
	  var newString = '{"name":"'+$('#wsp-name').val()+'","text":"'+wsp_text+'"}';
	  var newObj = JSON.parse(newString);
	  var oldString = Base64.decode(getQueryVar('t'));
	  var oldObj = JSON.parse(oldString);
	  oldObj.push(newObj);
	  var Obj = oldObj;
	  var wsp_json = Base64.encode(JSON.stringify(Obj));
	  var wsp_link = location.host + location.pathname + '?t=' + wsp_json;
	  var shortlink_api = 'https://api.uomg.com/api/long2dwz?dwzapi=tcn&url='+wsp_link;
	  $.getJSON(shortlink_api, function(data){ 
	    if(data.code==1 && data.ae_url){
	      wsp_link = data.ae_url;
		}
		else {
		  wsp_link = 'Something went wrong, try refreshing this page or contact the admin.';
		}
	    $('#wsp-link-output').text(wsp_link);
      });
  }
});