var logTime=0;
console.time();
function render(time) {
  if(logTime){console.timeEnd(); console.time();}
  drawObjects.length= 0;
  treeObjects.length= 0;

  dt=time-then;
  then=time;
  window_width =  gl.canvas.width/gl.canvas.height/cameraZoom;
  window_height= 1/cameraZoom;      

  handleKeys();

  twgl.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); 

  gl.depthMask(true);
  gl.enable(gl.BLEND);
 
  camera.improve();

  Dodecagrid.map(root_cell, cell, 5, function(current_cell, transform){
    if(current_cell.draws){
      for(let i=0; i<current_cell.draws.length; ++i){
        let M= m4.identity();
        m4.translate(M, [(current_cell.draws[i].d[1][0]+current_cell.draws[i].d[0][0])/2,  (current_cell.draws[i].d[1][1]+current_cell.draws[i].d[0][1])/2,  (current_cell.draws[i].d[1][2]+current_cell.draws[i].d[0][2])/2], M);
        m4.scale(M,     [(current_cell.draws[i].d[1][0]-current_cell.draws[i].d[0][0])/2,  (current_cell.draws[i].d[1][1]-current_cell.draws[i].d[0][1])/2,  (current_cell.draws[i].d[1][2]-current_cell.draws[i].d[0][2])/2], M);


        let N= m4.multiply(camera.inv_mat(), transform.product(current_cell.draws[i].t).mat());

        let uniforms= {
          uM: N,
          uEM: M,
          uColor: colors[0],
          uFov: cameraZoom,
          uAspect: gl.canvas.height/gl.canvas.width,
        };


        drawObjects.push({
          programInfo: programFromHyper,
          bufferInfo: blockBuffer,
          uniforms: uniforms
        });

      }
    }

    if(current_cell.root==-1) return;


    let q= quat.smallestRotation(v4.Z, dodecahedron.directions[current_cell.root]);
    quat.invert(q);
    let N= transform.mat();
    m4.multiply( camera.inv_mat(), N, N);
    m4.multiply(N, quat.mat(q), N);
    


    let uniforms= {
      uM: N,
      uColor: colors[current_cell.depth%nColors],
      uFov: cameraZoom,
      uAspect: gl.canvas.height/gl.canvas.width,
    };

    drawObjects.push({
      programInfo: program,
      bufferInfo: cbuffer,
      uniforms: uniforms
    });
  });

  if(placer.isActive){
    let M= m4.identity();
    m4.translate(M, [(placer.dims[1][0]+placer.dims[0][0])/2,  (placer.dims[1][1]+placer.dims[0][1])/2,  (placer.dims[1][2]+placer.dims[0][2])/2], M);
    m4.scale(M,     [(placer.dims[1][0]-placer.dims[0][0])/2,  (placer.dims[1][1]-placer.dims[0][1])/2,  (placer.dims[1][2]-placer.dims[0][2])/2], M);

    let pq= quat.inverse(placer.q);
    let placerTransform= camera.clone();
    quat.multiply(placerTransform.q, pq, placerTransform.q);
    let forward= forwardTransform.clone();
    quat.rotate(quat.inverse(pq), forward.p, forward.p);
    placerTransform.multiply(forward);

    let N= m4.multiply(camera.inv_mat(), placerTransform.mat());

    let uniforms= {
      uM: N,
      uEM: M,
      uColor: colors[0],
      uFov: cameraZoom,
      uAspect: gl.canvas.height/gl.canvas.width,
    };

    gl.useProgram(programFromHyper.program);
    twgl.setBuffersAndAttributes(gl, programFromHyper, blockBuffer);
    twgl.setUniforms(programFromHyper, uniforms);
    twgl.drawBufferInfo(gl, blockBuffer);
  }
  if(drawObjects.length)twgl.drawObjectList(gl, drawObjects);


  requestAnimationFrame(render);

  cell= Dodecagrid.absorb(cell, camera);

}