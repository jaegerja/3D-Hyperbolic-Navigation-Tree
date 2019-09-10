var pentagon= (function(){
	var edge_radius   = Math.acosh( Math.cos(Math.PI/4) / Math.sin(Math.PI/5) );
	var vertex_radius = Math.acosh( Math.cos(Math.PI/5) / Math.sin(Math.PI/5) );
	var side_length = 2*Math.acosh( Math.cos(Math.PI/5) / Math.sin(Math.PI/4) );
	var diameter = edge_radius + vertex_radius;

	return {
		edge_radius   : edge_radius   ,
		vertex_radius : vertex_radius ,
		side_length   : side_length   ,
		diameter      : diameter      
	};
}());

var dodecahedron= (function(){
	let cos  = Math.cos;
	let sin  = Math.sin;
	let asin = Math.asin;
	let atan = Math.atan;
	let PI   = Math.PI;
	let cosh = Math.cosh;
	let sinh = Math.sinh;
	let acosh= Math.acosh;

	var side_diameter= acosh(cosh(pentagon.side_length) * Math.cosh(pentagon.diameter) );
	var side_vertex_opposite_vertex = asin( Math.sinh(pentagon.diameter)/Math.sinh(side_diameter) );

	var edge_radius  = acosh( cosh(side_diameter)*cosh(pentagon.diameter) - sin(side_vertex_opposite_vertex)*sinh(side_diameter)*sinh(pentagon.diameter))/2;
	var vertex_radius= acosh( cosh(  edge_radius)*cosh(pentagon.diameter) - sin(PI/4)*sinh(edge_radius)*sinh(pentagon.diameter)); 
	var face_radius  = acosh( cosh(vertex_radius)/cosh(pentagon.vertex_radius));

	let ShDFR= sinh(face_radius);
	let ChDFR= cosh(face_radius);
	
	let directions = 
	[
		[+cos(atan(0.5))*cos(PI * 0 / 5.0), -sin(atan(0.5)), +cos(atan(0.5))*sin(PI * 0 / 5.0), 0],
		[+cos(atan(0.5))*cos(PI * 2 / 5.0), -sin(atan(0.5)), +cos(atan(0.5))*sin(PI * 2 / 5.0), 0],
		[+cos(atan(0.5))*cos(PI * 4 / 5.0), -sin(atan(0.5)), +cos(atan(0.5))*sin(PI * 4 / 5.0), 0],
		[+cos(atan(0.5))*cos(PI * 6 / 5.0), -sin(atan(0.5)), +cos(atan(0.5))*sin(PI * 6 / 5.0), 0],
		[+cos(atan(0.5))*cos(PI * 8 / 5.0), -sin(atan(0.5)), +cos(atan(0.5))*sin(PI * 8 / 5.0), 0],

		[-cos(atan(0.5))*cos(PI * 0 / 5.0), +sin(atan(0.5)), -cos(atan(0.5))*sin(PI * 0 / 5.0), 0],
		[-cos(atan(0.5))*cos(PI * 2 / 5.0), +sin(atan(0.5)), -cos(atan(0.5))*sin(PI * 2 / 5.0), 0],
		[-cos(atan(0.5))*cos(PI * 4 / 5.0), +sin(atan(0.5)), -cos(atan(0.5))*sin(PI * 4 / 5.0), 0],
		[-cos(atan(0.5))*cos(PI * 6 / 5.0), +sin(atan(0.5)), -cos(atan(0.5))*sin(PI * 6 / 5.0), 0],
		[-cos(atan(0.5))*cos(PI * 8 / 5.0), +sin(atan(0.5)), -cos(atan(0.5))*sin(PI * 8 / 5.0), 0],

		[0,-1,0,0],
		[0,+1,0,0]
	];
	let faces= 
	[
		[ShDFR*directions[ 0][0], ShDFR*directions[ 0][1], ShDFR*directions[ 0][2], ChDFR],
		[ShDFR*directions[ 1][0], ShDFR*directions[ 1][1], ShDFR*directions[ 1][2], ChDFR],
		[ShDFR*directions[ 2][0], ShDFR*directions[ 2][1], ShDFR*directions[ 2][2], ChDFR],
		[ShDFR*directions[ 3][0], ShDFR*directions[ 3][1], ShDFR*directions[ 3][2], ChDFR],
		[ShDFR*directions[ 4][0], ShDFR*directions[ 4][1], ShDFR*directions[ 4][2], ChDFR],
		[ShDFR*directions[ 5][0], ShDFR*directions[ 5][1], ShDFR*directions[ 5][2], ChDFR],
		[ShDFR*directions[ 6][0], ShDFR*directions[ 6][1], ShDFR*directions[ 6][2], ChDFR],
		[ShDFR*directions[ 7][0], ShDFR*directions[ 7][1], ShDFR*directions[ 7][2], ChDFR],
		[ShDFR*directions[ 8][0], ShDFR*directions[ 8][1], ShDFR*directions[ 8][2], ChDFR],
		[ShDFR*directions[ 9][0], ShDFR*directions[ 9][1], ShDFR*directions[ 9][2], ChDFR],
		[ShDFR*directions[10][0], ShDFR*directions[10][1], ShDFR*directions[10][2], ChDFR],
		[ShDFR*directions[11][0], ShDFR*directions[11][1], ShDFR*directions[11][2], ChDFR],
	];
	let norms = 
	[
		[ChDFR*directions[ 0][0], ChDFR*directions[ 0][1], ChDFR*directions[ 0][2], ShDFR],
		[ChDFR*directions[ 1][0], ChDFR*directions[ 1][1], ChDFR*directions[ 1][2], ShDFR],
		[ChDFR*directions[ 2][0], ChDFR*directions[ 2][1], ChDFR*directions[ 2][2], ShDFR],
		[ChDFR*directions[ 3][0], ChDFR*directions[ 3][1], ChDFR*directions[ 3][2], ShDFR],
		[ChDFR*directions[ 4][0], ChDFR*directions[ 4][1], ChDFR*directions[ 4][2], ShDFR],
		[ChDFR*directions[ 5][0], ChDFR*directions[ 5][1], ChDFR*directions[ 5][2], ShDFR],
		[ChDFR*directions[ 6][0], ChDFR*directions[ 6][1], ChDFR*directions[ 6][2], ShDFR],
		[ChDFR*directions[ 7][0], ChDFR*directions[ 7][1], ChDFR*directions[ 7][2], ShDFR],
		[ChDFR*directions[ 8][0], ChDFR*directions[ 8][1], ChDFR*directions[ 8][2], ShDFR],
		[ChDFR*directions[ 9][0], ChDFR*directions[ 9][1], ChDFR*directions[ 9][2], ShDFR],
		[ChDFR*directions[10][0], ChDFR*directions[10][1], ChDFR*directions[10][2], ShDFR],
		[ChDFR*directions[11][0], ChDFR*directions[11][1], ChDFR*directions[11][2], ShDFR],
	];
	let mats =
	[
		h4.reflectionMat(norms[ 0]),
		h4.reflectionMat(norms[ 1]),
		h4.reflectionMat(norms[ 2]),
		h4.reflectionMat(norms[ 3]),
		h4.reflectionMat(norms[ 4]),
		h4.reflectionMat(norms[ 5]),
		h4.reflectionMat(norms[ 6]),
		h4.reflectionMat(norms[ 7]),
		h4.reflectionMat(norms[ 8]),
		h4.reflectionMat(norms[ 9]),
		h4.reflectionMat(norms[10]),
		h4.reflectionMat(norms[11])
	];
	let transforms=
	[
		Transform.reflection(norms[ 0]),
		Transform.reflection(norms[ 1]),
		Transform.reflection(norms[ 2]),
		Transform.reflection(norms[ 3]),
		Transform.reflection(norms[ 4]),
		Transform.reflection(norms[ 5]),
		Transform.reflection(norms[ 6]),
		Transform.reflection(norms[ 7]),
		Transform.reflection(norms[ 8]),
		Transform.reflection(norms[ 9]),
		Transform.reflection(norms[10]),
		Transform.reflection(norms[11]) 
	];
	let connections= 
	[
	//  0          5          10
		0,1,0,0,1, 0,0,1,1,0, 1,0, //0
		1,0,1,0,0, 0,0,0,1,1, 1,0,
		0,1,0,1,0, 1,0,0,0,1, 1,0,
		0,0,1,0,1, 1,1,0,0,0, 1,0, 
		1,0,0,1,0, 0,1,1,0,0, 1,0,

		0,0,1,1,0, 0,1,0,0,1, 0,1, //5
		0,0,0,1,1, 1,0,1,0,0, 0,1, 
		1,0,0,0,1, 0,1,0,1,0, 0,1,
		1,1,0,0,0, 0,0,1,0,1, 0,1,
		0,1,1,0,0, 1,0,0,1,0, 0,1, 
			
		1,1,1,1,1, 0,0,0,0,0, 0,0, //10
		0,0,0,0,0, 1,1,1,1,1, 0,0
	];	
	return {
		edge_radius   : edge_radius   ,
		vertex_radius : vertex_radius ,
		face_radius   : face_radius   ,
		mats          : mats          ,
		directions    : directions    ,
		faces         : faces         ,
		norms         : norms         ,
		transforms    : transforms	  ,
		connections   : connections 
	};
}());


dodecahedron.absorb= function(transform){ //once
	for(var i=0; i<12; ++i) {
		if(h4.dot(transform.p, dodecahedron.norms[i]) < 0){
			transform.leftMultiply(dodecahedron.transforms[i]);
			return i;
		}
	}	
	return -1;
}

dodecahedron.isConnected= function(i, j){
	return dodecahedron.connections[12*i+j];
}