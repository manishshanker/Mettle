/**
* require is used for on demand loading of JavaScript
*
* // basic usage 
* require("comp1.js");
*
* @param  jsFiles string array or string holding the js file names to load
* @param  params object holding parameter like browserType, callback, cache
* @return The jQuery object
* @author Manish Shanker
*/

(function(){

window.require = function(jsFiles, params) {

    require.loadedLib = require.loadedLib || {};
    params = params || {};

    var bType = params.browserType===false?false:true;
    if (!bType){ 
        return; 
    }

    var cBack = params.callBack || function(){}; 
    var eCache = params.cache===false?false:true;
    
    if ( !require.scriptPath ) { 
        var path = document.getElementsByTagName('script')[0].getAttribute('src'); 
        require.scriptPath = path.replace(/\w+\.js$/, ''); 
    } 
    if (typeof jsFiles === "string") { 
        jsFiles = new Array(jsFiles); 
    } 
    for (var n=0; n< jsFiles.length; n++) { 
        if (!require.loadedLib[jsFiles[n]])	{
            var script = document.createElement("script");
            script.src = require.scriptPath + jsFiles[n];
            script.async = false;
            document.getElementsByTagName("head")[0].appendChild(script);
            require.loadedLib[jsFiles[n]] = true;	
        }
    }	
};
})();