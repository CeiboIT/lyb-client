var thecss=null,bCSS=true,pruleS=0;
var mxw=[700,1200,1600,2000,2600,3000,3600];
var lastSize=0,lastW=0,lastH=0;

function resizeCBX(){
//var wx=window,dx=document,ex=dx.documentElement,gx=dx.getElementsByTagName('body')[0],xx=wx.innerWidth||ex.clientWidth||gx.clientWidth,yx=wx.innerHeight||ex.clientHeight||gx.clientHeight;
var wx=window,dx=document,ex=dx.documentElement,gx=dx.getElementsByClassName('row')[0],xx=wx.innerWidth||ex.clientWidth||gx.clientWidth,yx=wx.innerHeight||ex.clientHeight||gx.clientHeight;
var i=0;
  for(i=0;i<mxw.length;i++){if(xx<mxw[i])break;}i+=2;
  lastSize=i;
  lastW=(100/i);
  lastH=(xx/i);
  var mos=document.getElementsByClassName("miniframe");
  for(var lx=0;lx<mos.length;lx++){
    mos[lx].style.width=(100/i)+"%";
    mos[lx].style.height=(xx/i*1.2)+"px";
  }
}

function bresizer(){window.onresize=resizeCBX;resizeCBX();}
window.onload=bresizer;
