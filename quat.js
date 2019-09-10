const quat= (function(){

	var copy= v4.copy;
	var clone=v4.clone;
	var create= v4.create;
	var tempquat1= create();
	var tempquat2= create();
	var tempv41= v4.create();

	function random(){
		let q= create();
		q[0]= 2*Math.random()-1;
		q[1]= 2*Math.random()-1;
		q[2]= 2*Math.random()-1;
		q[3]= 2*Math.random()-1;
		normalize(q);
		return q;
	}

	function set(q, t){
		q[0]= Math.sin(t/2)*q[0];
		q[1]= Math.sin(t/2)*q[1];
		q[2]= Math.sin(t/2)*q[2];
		q[3]= Math.cos(t/2);
	}

	function fastSet(q, t){
		q[0]*=      t/2;
		q[1]*=      t/2;
		q[2]*=      t/2;
		q[3]= 1 - t*t/8;
	}

	function multiply(q1, q2, qr){
		tempquat1[0]= q1[1]*q2[2] - q1[2]*q2[1] + q1[3]*q2[0] + q1[0]*q2[3];
		tempquat1[1]= q1[2]*q2[0] - q1[0]*q2[2] + q1[3]*q2[1] + q1[1]*q2[3];
		tempquat1[2]= q1[0]*q2[1] - q1[1]*q2[0] + q1[3]*q2[2] + q1[2]*q2[3];
		tempquat1[3]= q1[3]*q2[3] - q1[0]*q2[0] - q1[1]*q2[1] - q1[2]*q2[2];
		qr= qr||create();
		qr[0]= tempquat1[0];
		qr[1]= tempquat1[1];
		qr[2]= tempquat1[2];
		qr[3]= tempquat1[3];
		return qr;
	}

	function mat(u, M){
	  let x= u[0];
	  let y= u[1];
	  let z= u[2];
	  let r= u[3];
	  let m= 2/(v4.lengthSq(u));
	  M= M||new Float32Array(16);
	  M[0] = m*( -y*y -z*z) + 1.0 ; M[4] = m*( +x*y -z*r)       ; M[ 8] = m*( +x*z +y*r)       ; M[12] =  0 ;
	  M[1] = m*( +x*y +z*r)       ; M[5] = m*( -x*x -z*z) + 1.0 ; M[ 9] = m*( +y*z -x*r)       ; M[13] =  0 ;
	  M[2] = m*( +x*z -y*r)       ; M[6] = m*( +y*z +x*r)       ; M[10] = m*( -x*x -y*y) + 1.0 ; M[14] =  0 ;
	  M[3] = 0                    ; M[7] = 0                    ; M[11] = 0                    ; M[15] =  1 ;
	  return M; 
	}

	function inv_mat(u, M){
	  let x= -u[0];
	  let y= -u[1];
	  let z= -u[2];
	  let r=  u[3];
	  let m= 2/(v4.lengthSq(u));
	  M= M||new Float32Array(16);
	  M[0] = m*( -y*y -z*z) + 1.0 ; M[4] = m*( +x*y -z*r)       ; M[ 8] = m*( +x*z +y*r)       ; M[12] =  0 ;
	  M[1] = m*( +x*y +z*r)       ; M[5] = m*( -x*x -z*z) + 1.0 ; M[ 9] = m*( +y*z -x*r)       ; M[13] =  0 ;
	  M[2] = m*( +x*z -y*r)       ; M[6] = m*( +y*z +x*r)       ; M[10] = m*( -x*x -y*y) + 1.0 ; M[14] =  0 ;
	  M[3] = 0                    ; M[7] = 0                    ; M[11] = 0                    ; M[15] =  1 ;
	  return M; 
	}

	function inverse(q, qr){
		qr= qr||create();
		qr[0]=-q[0];
		qr[1]=-q[1];
		qr[2]=-q[2];
		qr[3]= q[3];
		return qr;
	}
	function invert(q){
		q[0]*=-1;
		q[1]*=-1;
		q[2]*=-1;
	}

	function rotate(q, p, pr){
		pr= pr||v4.create();
		var temp = p[3];
		p[3]=0;

		inverse( q, tempquat2);
		multiply(p, tempquat2,  tempquat2);
		multiply(q, tempquat2,  tempquat2);
		v4.multiply(1/v4.lengthSq(q), tempquat2);
		copy(tempquat2, pr);
		
		p[3] =temp;
		pr[3]=temp;
		return pr;
	}

	function inverseRotate(q, p, pr){
		pr= pr||v4.create();
		var temp = p[3];
		p[3]=0;

		inverse( q, tempquat2);
		multiply(tempquat2, p, tempquat2);
		multiply(tempquat2, q, tempquat2);
		v4.multiply(1/v4.lengthSq(q), tempquat2);
		copy(tempquat2, pr);
		p[ 3]=temp;
		qr[3]=temp;
		return pr;
	}

	function normalize(q){
		v4.multiply( 1/v4.length(q), q, q);
	}

	function improve(q){
		v4.multiply( 1/( 2*v4.lengthSq(q) )+0.5, q, q );
	}


	function smallestRotation(v1, v2, qr) {
		qr= qr||create();
		v3.cross(v1, v2, tempv41);
		var costh = v3.dot(v1, v2);

		v4.multiply( Math.sqrt(  Math.abs( (1 - costh)/(2.0*v3.lengthSq(tempv41) + .00000001) ) ), tempv41, tempv41);
		qr[0] = -tempv41[0];
		qr[1] = -tempv41[1];
		qr[2] = -tempv41[2];
		qr[3] = Math.sqrt((1 + costh) / 2.0);
		return qr;
	}



	function rotateX(q, t, qr){
		copy(v4.X, tempquat2);
		set(tempquat2, t);
		qr= qr||create();
		multiply(q, tempquat2, qr);
		return qr;
	}
	function rotateY(q, t, qr){
		v4.copy(v4.Y, tempquat2);
		set(tempquat2, t);
		qr= qr||create();
		multiply(q, tempquat2, qr);
		return qr;
	}
	function rotateZ(q, t, qr){
		copy(v4.Z, tempquat2);
		set(tempquat2, t);
		qr= qr||create();
		multiply(q, tempquat2, qr);
		return qr;
	}
	function rotateXfast(q, t, qr){
		copy(v4.X, tempquat2);
		fastSet(tempquat2, t);
		qr= qr||create();
		multiply(q, tempquat2, qr);
		return qr;
	}
	function rotateYfast(q, t, qr){
		copy(v4.Y, tempquat2);
		fastSet(tempquat2, t);
		qr= qr||create();
		multiply(q, tempquat2, qr);
		return qr;
	}
	function rotateZfast(q, t, qr){
		copy(v4.Z, tempquat2);
		fastSet(tempquat2, t);
		qr= qr||create();
		multiply(q, tempquat2, qr);
		return qr;
	}
	return {
		random: random,
		create: create,
		set: set,
		fastSet: fastSet,
		multiply: multiply,
		mat: mat,
		inv_mat: inv_mat,
		inverse: inverse,
		invert: invert,
		rotate: rotate,
		inverseRotate: inverseRotate,
		smallestRotation: smallestRotation,
		normalize: normalize,
		improve: improve,
		rotateX: rotateX,
		rotateY: rotateY,
		rotateZ: rotateZ,
		rotateXfast: rotateXfast,
		rotateYfast: rotateYfast,
		rotateZfast: rotateZfast
	};


}());