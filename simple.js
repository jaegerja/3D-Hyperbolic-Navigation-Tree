var camera= new Transform();

var trackballQuat= camera.q;



const keyW = 87;
const keyS = 83;
const keyA = 65;
const keyD = 68;
const keyE = 69;
const keyQ = 81;
const keyF = 70;

const keyUA= 38;
const keyDA= 40;
const keyLA= 37;
const keyRA= 39;
const keySPACE= 32;

var m4 = twgl.m4;
var gl = twgl.getWebGLContext(document.getElementById("game_canvas"));
twgl.resizeCanvasToDisplaySize(gl.canvas);

var program= twgl.createProgramInfo(gl,  ["temp_vs",  "temp_fs"]); 

var programFromHyper= twgl.createProgramInfo(gl,  ["from_hyper_vs",  "temp_fs"]); 

var quadBuffer = twgl.createBufferInfoFromArrays(gl, {
    pos:      {numComponents: 2, data: [-1,-1,  -1,1,  1,-1,  1,1]},
    indices:  [2, 1, 0, 1, 2, 3],
  });
var cameraZoom=2;

var window_width =  gl.canvas.width/gl.canvas.height/cameraZoom;
var window_height= 1/cameraZoom;      

var keyBools={};
function setKey(key, handle){
  keyBools[key]= {isDown: false, handle: handle};
}

var turnRate=  0.008;
var moveSpeed= 0.008;

setKey("ArrowDown",function(){ camera.rotateXfast(+turnRate);});
setKey("ArrowUp",function(){ camera.rotateXfast(-turnRate);});
setKey("ArrowLeft",function(){ camera.rotateYfast(-turnRate);});
setKey("ArrowRight",function(){ camera.rotateYfast(+turnRate);});
setKey("e", function(){ camera.rotateZfast(-turnRate);});
setKey("q", function(){ camera.rotateZfast(+turnRate);});
setKey("s", function(){ camera.translateZfast(-moveSpeed);});
setKey("w", function(){ camera.translateZfast(+moveSpeed);});
setKey("a", function(){ camera.translateXfast(-moveSpeed);});
setKey("d", function(){ camera.translateXfast(+moveSpeed);});

setKey("r", function(){ placer.adjustDims(+placer.dimsSensitivity);});
setKey("f", function(){ placer.adjustDims(-placer.dimsSensitivity);});

function handleKeys(){
  for(var key in keyBools){
    if(keyBools[key].isDown){
      keyBools[key].handle();
    }
  }  
}
gl.canvas.onmousedown = function(e){
  if(e.button==0){
  }
  else if(e.button==2){
  }
}
gl.canvas.onmouseup = function(e){
  if(e.button==0){
  }
  else if(e.button==2){
  }
}

var forwardTransform= new Transform;
forwardTransform.translateZ(1);

//h4.normalize(forwardTransform.p);

document.addEventListener('keydown', function(event){
  if(keyBools[event.key]){
    keyBools[event.key].isDown= true;
  }
  console.log(event.key);
  switch(event.key){


    case " ":
      if(!placer.isActive) {
        placer.begin();
        trackballQuat= placer.q;
      }
      else {
        cell.draws=cell.draws||[];

        let pq= quat.inverse(placer.q);
        let placerTransform= camera.clone();
        quat.multiply(placerTransform.q, pq, placerTransform.q);
        let forward= forwardTransform.clone();
        quat.rotate(quat.inverse(pq), forward.p, forward.p);
        placerTransform.multiply(forward);
        cell.draws.push({t: placerTransform, d: [placer.dims[0].slice(), placer.dims[1].slice()]} );
        trackballQuat= camera.q;
        placer.end();
      }
    break;
    case "c":
      placer.nextAxis();
      break;
    case "x":
      placer.oppositeSide();
      break;



  }
});
document.addEventListener('keyup', function(event){
  if(keyBools[event.key]){
     keyBools[event.key].isDown= false;
  }
  switch(event.key){

  }
});

document.body.onclick = function (e) {
    var isRightMB;
    e = e || window.event;
    if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        isRightMB = e.which == 3; 
    else if ("button" in e)  // IE, Opera 
        isRightMB = e.button == 2; 
   // alert("Right mouse button " + (isRightMB ? "" : " was not") + "clicked!");
} 

gl.canvas.style.background = 'white';
twgl.resizeCanvasToDisplaySize(gl.canvas);
var dt=0;
var then=Date.now();

//gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);
function startRendering() {
  var then=0;
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
 // gl.depthFunc(gl.GREATER);
  var dt=9;
  requestAnimationFrame(render);
}

gl.canvas.requestPointerLock = gl.canvas.requestPointerLock ||
                            gl.canvas.mozRequestPointerLock;
document.exitPointerLock = document.exitPointerLock ||
                           document.mozExitPointerLock;


                           
gl.canvas.onclick = function() {
  gl.canvas.requestPointerLock();
};
document.addEventListener('pointerlockchange', lockEvent, false);
document.addEventListener('mozpointerlockchange', lockEvent, false);

function lockEvent() {
  if (document.pointerLockElement === gl.canvas ||
      document.mozPointerLockElement === gl.canvas) 
    document.addEventListener("mousemove", trackball, false);
  else 
    document.removeEventListener("mousemove", trackball, false);
}

function trackball(e) {
  quat.rotateYfast(trackballQuat, e.movementX/300, trackballQuat);
  quat.rotateXfast(trackballQuat, e.movementY/300, trackballQuat);
}


var cbuffer= cylinderBuffer(.1, 2*dodecahedron.face_radius, 6, 6);


var blockBuffer= cubeBuffer(10);

gl.canvas.requestPointerLock();
startRendering();

var root_cell= new Dodecagrid();
var cell= root_cell;

var colors= [];

var nColors=8;
for(var i=0; i<nColors; ++i){
  colors.push(v3.create( (Math.sin(2*Math.PI*( 0/3 + i/nColors )  )+1)/2, (Math.sin(2*Math.PI*( 1/3 + i/nColors )  )+1)/2, (Math.sin(2*Math.PI*( 2/3 + i/nColors )  )+1)/2 )   );
}

var drawObjects= [];
var treeObjects= [];
