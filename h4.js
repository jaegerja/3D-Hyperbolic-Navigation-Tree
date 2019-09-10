var h4= (function(){

	var tempv41= v4.create();
	var tempv42= v4.create();

	var INVMAT= new Float32Array(16);
	INVMAT[0]=-1; INVMAT[4]= 0; INVMAT[ 8]= 0; INVMAT[12]= 0;
	INVMAT[1]= 0; INVMAT[5]=-1; INVMAT[ 9]= 0; INVMAT[13]= 0;
	INVMAT[2]= 0; INVMAT[6]= 0; INVMAT[10]=-1; INVMAT[14]= 0;
	INVMAT[3]= 0; INVMAT[7]= 0; INVMAT[11]= 0; INVMAT[15]=+1;
 
	var create= v4.create;

	function random(){
		var out= create();

		out[0]= 2*Math.random()-1;
		out[1]= 2*Math.random()-1;
		out[2]= 2*Math.random()-1;
		out[3]= Math.sqrt(1-dot(out, out));

		return out;
	}

	function random_norm(){
		let out= create();

		let d= Math.random();
		let t= 2*Math.PI*Math.random();
		let p= Math.PI*Math.random();

		out[0]= Math.cos(p)*Math.cos(t)*Math.cosh(d);
		out[1]= Math.cos(p)*Math.sin(t)*Math.cosh(d);
		out[2]= Math.sin(p)*Math.cosh(d);
		out[3]= Math.sinh(d);

		return out;
	}

	//lorentz dot product
	function dot(x, y){
		return x[3]*y[3] - x[2]*y[2] - x[1]*y[1] - x[0]*y[0];
	}

	function mat(u, M){
		let x= u[0];
		let y= u[1];
		let z= u[2];
		let n= u[3];
		let m= 1.0/(1.0 + n);
		M= M||new Float32Array(16);
		M[0] = m*x*x + 1.0 ; M[4] = m*x*y       ; M[ 8] = m*x*z       ; M[12] = +x ;
		M[1] = m*y*x       ; M[5] = m*y*y + 1.0 ; M[ 9] = m*y*z       ; M[13] = +y ;
		M[2] = m*z*x       ; M[6] = m*z*y       ; M[10] = m*z*z + 1.0 ; M[14] = +z ;
		M[3] =    +x       ; M[7] =    +y       ; M[11] =    +z       ; M[15] =  n ;
		return M; 
	}

	function inv_mat(u, M){
		let x= u[0];
		let y= u[1];
		let z= u[2];
		let n= u[3];
		let m= 1.0/(1.0 + n);
		M= M||new Float32Array(16);
		M[0] = m*x*x + 1.0 ; M[4] = m*x*y       ; M[ 8] = m*x*z       ; M[12] = -x ;
		M[1] = m*y*x       ; M[5] = m*y*y + 1.0 ; M[ 9] = m*y*z       ; M[13] = -y ;
		M[2] = m*z*x       ; M[6] = m*z*y       ; M[10] = m*z*z + 1.0 ; M[14] = -z ;
		M[3] =    -x       ; M[7] =    -y       ; M[11] =    -z       ; M[15] =  n ;
		return M; 
	}

	//reflect about plane followed by inversion about origin
	function reflectionInversionMat(n, M){
		var x= n[0];
		var y= n[1];
		var z= n[2];
		var w= n[3];

		M= M||new Float32Array(16);
		M[0] =  2*x*x - 1.0 ; M[4] =  2*x*y       ; M[ 8] =  2*x*z       ; M[12] = -2*x*w       ;
		M[1] =  2*y*x       ; M[5] =  2*y*y - 1.0 ; M[ 9] =  2*y*z       ; M[13] = -2*y*w       ;
		M[2] =  2*z*x       ; M[6] =  2*z*y       ; M[10] =  2*z*z - 1.0 ; M[14] = -2*z*w       ;
		M[3] = -2*w*x       ; M[7] = -2*w*y       ; M[11] = -2*w*z       ; M[15] =  2*w*w + 1.0 ;
		return M; 
	}
	function reflectionMat(n, M){
		var x= n[0];
		var y= n[1];
		var z= n[2];
		var w= n[3];

		M= M||new Float32Array(16);
		M[0] = -2*x*x + 1.0 ; M[4] = -2*x*y       ; M[ 8] = -2*x*z       ; M[12] = 2*x*w       ;
		M[1] = -2*y*x       ; M[5] = -2*y*y + 1.0 ; M[ 9] = -2*y*z       ; M[13] = 2*y*w       ;
		M[2] = -2*z*x       ; M[6] = -2*z*y       ; M[10] = -2*z*z + 1.0 ; M[14] = 2*z*w       ;
		M[3] = -2*w*x       ; M[7] = -2*w*y       ; M[11] = -2*w*z       ; M[15] = 2*w*w + 1.0 ;
		return M; 
	}

	//change the origin of a point or spacial derivative
	function translate(x, y, vr){
		vr= vr||v4.create();
	  	
	  	var dot3= v4.dot3(x, y);
	  	var xmul= +y[3] + dot3/(x[3]+1);
	  	vr[0]= xmul*x[0] + y[0];
	  	vr[1]= xmul*x[1] + y[1];  
	  	vr[2]= xmul*x[2] + y[2];
	  	vr[3]=+dot3 + x[3]*y[3];
	  	
	  	return vr;
	}

	function inverseTranslate(x, y, vr){
		vr= vr||v4.create();
	  	var dot3= x[0]*y[0] + x[1]*y[1] + x[2]*y[2];
	  	var xmul= -y[3] + v4.dot3/(x[3]+1);

	  	vr[0]= xmul*x[0] + y[0];
	  	vr[1]= xmul*x[1] + y[1];  
	  	vr[2]= xmul*x[2] + y[2];
	  	vr[3]=-dot3 + x[3]*y[3];
	  	return vr;
	}

	function twoPointQuat(p1, p2, qr){
		qr= qr||quat.create();
		qr[0] = p1[2]*p2[1] - p1[1]*p2[2];
		qr[1] = p1[0]*p2[2] - p1[2]*p2[0];
		qr[2] = p1[1]*p2[0] - p1[0]*p2[1];
		qr[3] = v4.dot(p1,p2)+p1[3]+p2[3]+1;
		quat.normalize(qr);
		return qr;
	}

	function translationQuat(d, p, qr){
		qr= qr||quat.create();
		let m = 1 / (2 * (p[3] + 1));
		qr[0] = m*( d[1] * p[2] - d[2] * p[1] );
		qr[1] = m*( d[2] * p[0] - d[0] * p[2] );
		qr[2] = m*( d[0] * p[1] - d[1] * p[0] );
		qr[3] = 1;
		return qr;
	}

	function reflect(p, n, pr){
		pr= pr||v4.create();
		v4.multiply(2*dot(p,n), n, tempv41);
		v4.add(p, tempv41, tempv41);
		v4.copy(tempv41, pr);
		return pr;
	}

	function invert(h){
		h[0]*= -1;
		h[1]*= -1;
		h[2]*= -1;		
	}

	function inverse(h, hr){
		hr= hr||v4.create();
		hr[0]= -h[0];
		hr[1]= -h[1];
		hr[2]= -h[2];
		hr[3]=  h[3];
		return hr;
	}

	function normalize(h){
		v4.multiply( 1/Math.sqrt(Math.abs( dot(h,h) ) ) , h, h);
	}

	function improve(h){
		v4.multiply( 1/(2*dot(h,h)) + 0.5, h, h);
	}

	return {
		random: random,
		random_norm: random_norm,
		origin: v4.W,
		INVMAT: INVMAT,
		dot: dot,
		mat: mat,
		inv_mat: inv_mat,
		translate: translate,
		inverseTranslate: inverseTranslate,
		twoPointQuat: twoPointQuat,
		translationQuat: translationQuat,
		reflect: reflect,
		inverse: inverse,
		invert: invert,
		normalize: normalize,
		improve: improve,
		reflectionMat: reflectionMat

	};

}());

