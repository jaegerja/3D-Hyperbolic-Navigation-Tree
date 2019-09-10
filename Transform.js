class Transform{
	constructor(){
		this.p=[0,0,0,1];
		this.q=[0,0,0,1];
		this.i= 0;
	}
	clone(){
		let out= new Transform;
		out.p= this.p.slice();
		out.q= this.q.slice();
		out.i= this.i;
		return out;
	}
}

Transform.tempm41= new Float32Array(16);
Transform.tempm42= new Float32Array(16);
Transform.tempv41= v4.create();
Transform.tempv42= v4.create();
Transform.tempquat1= quat.create();

Transform.prototype.translateLocalFast= function(v){
	
	v4.copy(v, Transform.tempv41);
	
	if(this.i) h4.invert(Transform.tempv41);
	
	quat.rotate(this.q, Transform.tempv41, Transform.tempv41);
	this.translateSemiLocalFast(Transform.tempv41);
}

Transform.prototype.translateSemiLocalFast= function(v){
	h4.translationQuat(v, this.p, Transform.tempquat1);
	quat.multiply(Transform.tempquat1, this.q, this.q);
	h4.translate(this.p, v, Transform.tempv41);
	v4.add(Transform.tempv41, this.p, this.p)
}

Transform.prototype.translateGlobalFast= function(v){
	h4.translationQuat(v, this.p, Transform.tempquat1);
	v4.add(v, this.p, this.p);
	quat.multiply(Transform.tempquat1, this.q, this.q);
}

Transform.prototype.translateLocal= function(right){
	quat.rotate(this.q, right, Transform.tempv41);
	if(this.i) h4.invert(Transform.tempv41);
	
	h4.twoPointQuat(this.p, Transform.tempv41, Transform.tempquat1);
	quat.multiply(Transform.tempquat1, this.q, this.q);

	h4.translate( this.p, Transform.tempv41, Transform.tempv41);
	v4.add(Transform.tempv41, this.p, this.p);
}


Transform.prototype.mat= function(M){
	M= M||new Float32Array(16);

	h4.mat(this.p, Transform.tempm41);
	quat.mat(this.q, M);
	m4.multiply(Transform.tempm41, M, M);

	if(this.i) m4.multiply(M, h4.INVMAT, M);
	return M;
}

Transform.prototype.inv_mat= function(M){
	M= M||new Float32Array(16);

	quat.inv_mat(this.q, Transform.tempm41);
	h4.inv_mat(this.p, M);

	m4.multiply(Transform.tempm41, M, M);

	if(this.i) m4.multiply(h4.INVMAT, M, M);
	return M;
}

Transform.prototype.product= function(right){
	let out= new Transform;

	quat.rotate(this.q, right.p, out.p);
	if(this.i) h4.invert(out.p);

	h4.twoPointQuat(this.p, out.p, out.q);

	quat.multiply(out.q,  this.q, out.q);
	quat.multiply(out.q, right.q, out.q);
	
	out.p= h4.translate(this.p, out.p);
	out.i= this.i!=right.i;

	return out;
}


Transform.prototype.translateLocal= function(right){
	quat.rotate(this.q, right, Transform.tempv41);
	if(this.i) h4.invert(Transform.tempv41);
	
	h4.twoPointQuat(this.p, Transform.tempv41, Transform.tempquat1);
	quat.multiply(Transform.tempquat1, this.q, this.q);

	h4.translate( this.p, Transform.tempv41, this.p);
}


Transform.prototype.multiply= function(right){	
	quat.rotate(this.q, right.p, Transform.tempv41);
	if(this.i) h4.invert(Transform.tempv41);
	
	h4.twoPointQuat(this.p, Transform.tempv41, Transform.tempquat1);

	quat.multiply(Transform.tempquat1, this.q, Transform.tempquat1);
	quat.multiply(Transform.tempquat1, right.q, this.q);

	h4.translate(this.p, Transform.tempv41, this.p);
	this.i= this.i!=right.i; 
}

Transform.prototype.leftMultiply= function(left){
	quat.rotate(left.q, this.p, this.p);
	if(left.i) h4.invert(this.p);

	h4.twoPointQuat(left.p, this.p, Transform.tempquat1);

	quat.multiply(Transform.tempquat1, left.q, Transform.tempquat1);
	quat.multiply(Transform.tempquat1, this.q, this.q);

	h4.translate(left.p, this.p, this.p);
	this.i= this.i!=left.i; 
}

Transform.prototype.translateGlobal= function(left){	
	quat.rotate(this.q, left, Transform.tempv41);
	if(this.i) h4.invert(Transform.tempv41);
	
	h4.twoPointQuat(Transform.tempv41, this.p, Transform.tempquat1);
	quat.multiply(Transform.tempquat1, this.q, this.q);

	h4.translates(tempv41, this.p, this.p);
}


Transform.prototype.invert= function(){
	quat.invert(this.q);
	if(!this.i) h4.invert(this.p)
	quat.rotate(this.q, this.p, this.p);
}

Transform.prototype.improve= function(){
	h4.improve( this.p);
	quat.improve(this.q);
}
Transform.prototype.normalize= function(){
	h4.normalize(this.p);
	quat.normalize(this.q);
}

Transform.prototype.transform= function (v, vr){
	vr= vr||v4.create();
	quat.rotate(this.q, v, vr);
	if(this.i) h4.invert(vr);
	h4.translate(this.p, vr, vr);
	return vr;
}


Transform.prototype.translateXfast= function(dist){
	v4.multiply(dist, v4.X, Transform.tempv42);
	this.translateLocalFast(Transform.tempv42);
}
Transform.prototype.translateYfast= function(dist){
	v4.multiply(dist, v4.Y, Transform.tempv42);
	this.translateLocalFast(Transform.tempv42);
}
Transform.prototype.translateZfast= function(dist){
	v4.multiply(dist, v4.Z, Transform.tempv42);
	this.translateLocalFast(Transform.tempv42);
}

Transform.prototype.translateX= function(dist){
	v4.copy(v4.ZERO, Transform.tempv42);
	Transform.tempv42[0]= Math.sinh(dist);
	Transform.tempv42[3]= Math.cosh(dist);
	this.translateLocal(Transform.tempv42);
}
Transform.prototype.translateY= function(dist){
	v4.copy(v4.ZERO, Transform.tempv42);
	Transform.tempv42[1]= Math.sinh(dist);
	Transform.tempv42[3]= Math.cosh(dist);
	this.translateLocal(Transform.tempv42);
}
Transform.prototype.translateZ= function(dist){
	v4.copy(v4.ZERO, Transform.tempv42);
	Transform.tempv42[2]= Math.sinh(dist);
	Transform.tempv42[3]= Math.cosh(dist);
	this.translateLocal(Transform.tempv42);
}

Transform.prototype.rotateGlobal= function(r){
	quat.rotate(r,   this.p, this.p);
	quat.multiply(r, this.q, this.q);
}


Transform.prototype.rotateXfast= function(rad){
	quat.rotateXfast(this.q, rad, this.q);
}
Transform.prototype.rotateYfast= function(rad){
	quat.rotateYfast(this.q, rad, this.q);
}
Transform.prototype.rotateZfast= function(rad){
	quat.rotateZfast(this.q, rad, this.q);
}


Transform.reflection= function(norm){
	var out= new Transform();

	v4.multiply(2*norm[3], norm, out.p);
	v4.add(h4.origin, out.p, out.p);

	v4.copy(norm, out.q);
	out.q[3]=0;
	quat.normalize(out.q);
	out.i= 1;
	return out;
}

Transform.random= function(){
	var out= new Transform();
	out.p= h4.random();
	out.q= quat.random();
	out.i= 0;
	return out;
}


/*
Transform.orientPlane= function(norm) {
	var out= new Transform();

	v4.multiply(norm.w, norm, out.p);
	v4.add(h4.orign, out.p, out.p);
	h4.normalize(out.p);
	out.inverseTransform(norm, tempv);
	out.q = smallestRot(tempv, v4.j);
	return out;
}
*/