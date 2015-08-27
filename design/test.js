var scripts=document.getElementsByTagName("script");
for(var i= 0,len=scripts.length;i<len;i++){
    console.log("src:"+scripts[i].src);
    console.log("readyState:"+scripts[i].readyState);
}