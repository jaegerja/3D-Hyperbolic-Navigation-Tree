var v3= twgl.v3;

var v4= (function(){

	function create(){
		return new Float32Array(4); 
	}


	const X= new Float32Array([1,0,0,0]);
	const Y= new Float32Array([0,1,0,0]);
	const Z= new Float32Array([0,0,1,0]);
	const W= new Float32Array([0,0,0,1]);
	const ZERO= new Float32Array([0,0,0,0]); 


	var tempv41= create(); 

	function sqr(x){
		return x*x;
	}

	function multiply(s, v, vr){
	  	vr= vr||create();
	  	vr[0]= s*v[0];
	  	vr[1]= s*v[1];
	  	vr[2]= s*v[2];
	  	vr[3]= s*v[3];
	  	return vr;
	}
	function add(x, y, vr){
		vr= vr||create();
		vr[0]= x[0]+y[0];
		vr[1]= x[1]+y[1];
		vr[2]= x[2]+y[2];
		vr[3]= x[3]+y[3];
		return vr;
	}
	function subtract(x, y, vr){
		vr= vr||create();
		vr[0]= x[0]-y[0];
		vr[1]= x[1]-y[1];
		vr[2]= x[2]-y[2];
		vr[3]= x[3]-y[3];
		return vr;
	}
	function copy(src, trgt) {
		trgt[0]= src[0];
		trgt[1]= src[1];
		trgt[2]= src[2];
		trgt[3]= src[3];
	}
	function clone(src) {
		var cp= create();
		cp[0]=src[0];
		cp[1]=src[1];
		cp[2]=src[2];
		cp[3]=src[3];
		return cp;
	}

	function cross(v1, v2, v3){
		v3= v3||create();
		tempv41[0]= v1[1]*v2[2] - v1[2]*v2[1];
		tempv41[1]= v1[2]*v2[0] - v1[0]*v2[2];
		tempv41[2]= v1[0]*v2[1] - v1[1]*v2[0];
		v3[0]= tempv41[0];
		v3[1]= tempv41[1]
		v3[2]= tempv41[2]
		return v3;
	}

	function dot(v1, v2){
		return v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2]+ v1[3]*v2[3];
	}
	function dot3(v1, v2){
		return v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2];
	}
	function lengthSq(v) {
		return dot(v,v);
	}
	function length(v){
		return Math.sqrt(lengthSq(v));
	}

	return {
		X: X,
		Y: Y,
		Z: Z,
		W: W,
		ZERO: ZERO,
		create: create,
		copy: copy,
		clone: clone,
		multiply: multiply,
		add: add,
		subtract: subtract,
		cross: cross,
		dot: dot,
		dot3: dot3,
		length: length,
		lengthSq: lengthSq
	};
}());

twgl.m4.transform= function(M, v, vr){
	vr= vr||v4.create();

	for(var i=0; i<4; ++i){
		vr[i]=0;
		for(var j=0; j<4; ++j){
			vr[i]+= M[i+4*j]*v[j];
		}
	}
	return vr;
}

