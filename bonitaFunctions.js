// Library of tools for Bonita BPM solution

/**
 * @author FRO
 * @date 14/06/23
 */

/**
 * @name callRest
 * @desc Appel distant
 * @param {string} p_url
 * @param {json} p_tabSetting
 *  + ajax
 *  - contentType (default: 'application/x-www-form-urlencoded; charset=UTF-8')
 *  - dataType (default: data return type Intelligent Guess (xml, json, script, or html))
 *  - type (default: 'GET')
 *  + involved
 *  - functionRetour (default : null)
 * @param {json} p_tabInput
 * @returns {array}
 */
function callRest(p_url, p_tabSetting, p_tabInput) {
    try {
        var jsonAjaxParam = {
            url : p_url
            , contentType : 'application/x-www-form-urlencoded; charset=UTF-8'
            , dataType : 'json'
            , type : 'GET'
        };
        
        p_tabInput.milis = getMilise();
        
        jsonAjaxParam.data = p_tabInput;
        
        //traitement determinant async ou pas
        var async = true;
        if(p_tabSetting.functionRetour == null){
            async = false;
            jsonAjaxParam.async = false;
        }
        
        for(var indice in p_tabSetting){
            jsonAjaxParam[indice] = p_tabSetting[indice];
        }
        
        //si retour synchron init retour
        var v_retourSync = null;
        
        jsonAjaxParam.success = function(p_retour, p_statut){
            if(async){
                mainfunc(p_tabSetting.functionRetour, p_retour);
            }else{
                v_retourSync = p_retour;
            }
        };
        
        jsonAjaxParam.error = function(p_resultat, p_statut, p_erreur){
            v_retourSync = p_resultat.responseText + " - " + p_statut + " - " + p_erreur.message;
        };

        var ajax = $.ajax(jsonAjaxParam);
         
        return v_retourSync;
    } catch (er) {
        throw new Error(er.message);
        return null;
    } 
}

/**
 * isInArray
 * @param {string} p_value
 * @param {array} p_array
 * @returns {Boolean}
 */
function isInArray(p_value, p_array) {
    //input : 2013-08-21
    try {
        var boolRetour = false;

        for(indice in p_array){
            if(p_value == p_array[indice]){
                boolRetour = true;
                break;
            }
        }

        return boolRetour;
    } catch (er) {
        log(0, "ERROR(isInArray):" + er.message);
        return null;
    }
}

/**
 * isLogin
 * @param {json} p_input
 * @returns {boolean}
*/
function isLogin() {
   try {
        var strUrl = g_rootRest+"/API/bpm/process";
        
        var tabSetting = { 
        };
        
        var tabInput = { 
            p : 0, 
            c : 10
        };
        
        var retour = callRest(strUrl, tabSetting, tabInput);
        
        return true;
   } catch (er) {
       return false;
   }
}

/**
 * getMilise
 * @returns {@exp;d@call;getTime}
 */
function getMilise() {
    var d = new Date();
    return d.getTime();
}

/**
* getParamGet
* @param {String} name
* @returns {String}
*/
function getParamGet(name) {
   try {
       var currentWindow = window;
       var strUrl = currentWindow.location.href;
       strUrl = decodeURIComponent(strUrl);
       var start = strUrl.indexOf("?" + name + "=");
       if (start < 0) start = strUrl.indexOf("&" + name + "=");
       if (start < 0) return null;
       start += name.length + 2;
       var end = strUrl.indexOf("&", start) - 1;
       if (end < 0) end = strUrl.length;
       var result = '';
       for (var i = start; i <= end; i++) {
           var c = strUrl.charAt(i);
           result = result + (c == '+' ? ' ' : c);
       }
       return unescape(result);
   } catch (er) {
       throw new Error(er.message);
       return null;
   }
}

/**
* getSessionInfo
* @return {json} description
*/
function getSessionInfo() {
   try {
        var strUrl = g_rootRest+"/API/system/session/1";
        
        var tabInput = { 
        };
        
        var tabSetting = {
        };
        
        var retour = callRest(strUrl, tabSetting, tabInput);
        
        return retour;
   } catch (er) {
       throw new Error(er.message);
       return null;
   }
}


/**
* login
* @param {json} p_input
*/
function login(p_input) {
   try {
        var strUrl = g_rootRest+"/loginservice";
        
        var tabSetting = {
            type : 'POST'
        };
        
        var retour = callRest(strUrl, tabSetting, p_input);
   } catch (er) {
       throw new Error(er.message);
   }
}

/**
* logout
* @param {json} p_input
* { 
*   redirect: true or false
* }
*/
function logout(p_input) {
   try {
       var strUrl = g_rootRest+"/logoutservice";
        
        var tabSetting = {
        };
        
        var retour = callRest(strUrl, tabSetting, p_input);
   } catch (er) {
       throw new Error(er.message);
   }
}

/**
 * mainfunc
 * @param {Function} func
 */
function mainfunc (func){
    this[func].apply(this, Array.prototype.slice.call(arguments, 1));
}

/**
 * @name openActivity
 * @param {string} processName ex Feedback
 * @param {string} processVersion ex 1.1
 * @param {string} formName ex Manage+feedback
 * @param {string} taskId ex 25826
 */
function openActivity(p_processName, p_processVersion, p_formName, p_taskId, p_window) {
    try {
        var strUrl = g_rootRest+"?ui=form&locale=en#form="+p_processName+"--"+p_processVersion+"--"+p_formName+"$entry&task="+p_taskId+"&mode=form&assignTask=true";

        p_window.open(strUrl);
    } catch (er) {
        throw new Error(er.message);
    }
}

/**
 * @name take
 * @desc Hello
 * @p_param{string} param
 * @returns {boolean}
 */
function take(p_taskId, p_userId) {
	try {
		var url = g_rootRest + "/API/bpm/humanTask/" + p_taskId;

		var tabSetting = {
			type : 'PUT'
			, contentType : 'application/json'
			, dataType : 'text'
		};

		var tabInput = '{"assigned_id":"'+p_userId+'"}';

		var retour = _callRest(url, tabSetting, tabInput);

		if(retour == ""){
			$('#btTake_'+p_taskId).hide();
		}

		return true;
	} catch (er) {
		console.log(0, "ERROR($.functionsApp.take):" + er.message);
		return false;
	}
}

 /**
  * @name dotIt
  * @desc Hello
  * @p_param{string} param
  * @returns {boolean}
  */
function dotIt(p_processName, p_processVersion, p_taskName, p_taskId) {
	 try {
		var strUrl = g_rootRest+"?ui=form&locale=en#form="+p_processName+"--"+p_processVersion+"--"+p_taskName+"$entry&task="+p_taskId+"&mode=form&assignTask=true";

		document.location.href=strUrl;

		 return true;
	 } catch (er) {
		 console.log(0, "ERROR($.functionsApp.dotIt):" + er.message);
		 return false;
	 }
 }