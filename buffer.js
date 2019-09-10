function cylinderBuffer(R, L, n_around, n_long){
  var positions=   [];
  var normals=   [];
  var texcoords=   [];
  var indices= [];
  var coshR= Math.cosh(R);
  var sinhR= Math.sinh(R);
  for(var x=0; x<=n_long; ++x){
    var s= x/n_long;
    var coshX= Math.cosh(L*s);
    var sinhX= Math.sinh(L*s);
    for(var th=0; th<n_around; ++th){
      var t= th/n_around;

      var theta=t*2*Math.PI;
      var cosT= Math.cos(theta);
      var sinT= Math.sin(theta);

      positions.push(sinhR*cosT);
      positions.push(sinhR*sinT);
      positions.push(coshR*sinhX);
      positions.push(coshR*coshX);

      normals.push(coshR*cosT);
      normals.push(coshR*sinT);
      normals.push(sinhR*sinhX);
      normals.push(sinhR*coshX);

      texcoords.push(s);
      texcoords.push(t);
    }
  }
  for(var x=0; x<n_long; ++x){
    for(var th=0; th<n_around; ++th){
      indices.push(n_around*(x+0) + (th+0)         );
      indices.push(n_around*(x+1) + (th+0)         );
      indices.push(n_around*(x+0) + (th+1)%n_around);

      indices.push(n_around*(x+1) + (th+0)         );
      indices.push(n_around*(x+1) + (th+1)%n_around);
      indices.push(n_around*(x+0) + (th+1)%n_around);
    }
  }

  return twgl.createBufferInfoFromArrays(gl, {
    aPosition: {numComponents: 4, data: positions},
    aTexcoord: {numComponents: 2, data: texcoords},
    aNormal:   {numComponents: 4, data: normals},
    indices: indices,
  });
}

function cubeBuffer(L){
  var positions=   [];
  var normals=   [];
  var texcoords=   [];
  var indices= [];

  for(var sgn=-1; sgn<=1; sgn+=2)       {
  for(var offset=0; offset<3; ++offset) {
  for(var y=0; y<=L; ++y)               {
  for(var x=0; x<=L; ++x)               {
      var pos= [0,0,0,1];
      var norm=[0,0,0,0];
      pos[(offset+2)%3]= 2*x/L-1;
      pos[(offset+1)%3]= 2*y/L-1;
      pos[(offset+0)%3]= sgn;
      norm[offset]= sgn;

      positions.push.apply(positions, pos);
      normals.push.apply(normals, norm);
      texcoords.push.apply(texcoords, [0,0]);
  }
  }
  }
  }

  let K= L+1;
  for(var face=0; face<6; ++face) {
  for(var y=0; y<L; ++y)          {
  for(var x=0; x<L; ++x)          {
    indices.push((x+0) + (y+0)*K + face*K*K);
    indices.push((x+1) + (y+0)*K + face*K*K);
    indices.push((x+0) + (y+1)*K + face*K*K);

    indices.push((x+1) + (y+0)*K + face*K*K);
    indices.push((x+1) + (y+1)*K + face*K*K);
    indices.push((x+0) + (y+1)*K + face*K*K);
  }
  }
  }

  return twgl.createBufferInfoFromArrays(gl, {
    aPosition: {numComponents: 4, data: positions},
    aTexcoord: {numComponents: 2, data: texcoords},
    aNormal:   {numComponents: 4, data: normals},
    indices: indices,
  });
}
