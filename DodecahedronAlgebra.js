class Dodecagrid{
	constructor(root_cell, root_face) {
		this.neighbors= [null,null,null,
		                 null,null,null,
		                 null,null,null, 
		                 null,null,null];
		this.root= -1;
		this.depth= 0;		                 
		if(root_cell){
			this.neighbors[     root_face]= root_cell;
			this.root=          root_face;
			root_cell.neighbors[root_face]= this;
			this.depth= root_cell.depth+1;		
		}
		++Dodecagrid.ncells;
	}
}


Dodecagrid.ncells=0;

class DodecagridPlane{
	constructor(face){
		this.face= face;
		this.polarity= 1;
		this.path= [];
	}
}

Dodecagrid.prototype.at= function(face){
	if(this.neighbors[face]){
		return this.neighbors[face];
	}
	else{
		let cell= this;
		let path= [face];
		let i= 1; //  resolved i->length
		let j= 0; //unresolved 0->j

		// a reflection that is swappable with the new reflection
		// can be swapped with at most three reflections that are not
		// themselves swappable with the new reflection (ie. a corner)
		const n_to_resolve= 3;

		while(j>=0){ // while unresolved items in path
			while(i>path.length-n_to_resolve&&cell.root!=-1){
				path.push(cell.root);
				cell= cell.neighbors[cell.root];
			}
			
			if(i<path.length&&path[i]==path[j]){ //reflections cancel with themselves
				++i;
				--j;
				continue;
			}

			let valid_swap= 0;
			for(let ix=0; ix<n_to_resolve && ix<path.length-i ; ++ix){ 
				//blocked item can and should swap with new
				valid_swap= path[j]<path[i+ix]&&dodecahedron.isConnected(path[j], path[i+ix]);

				//check that blocking reflections swap with blocked reflection
				for(let iy=0; iy<ix; ++iy){
					valid_swap= valid_swap&&dodecahedron.isConnected(path[i+ix],path[i+iy]);
				}

				if(valid_swap){
					for(let iy=0; iy<=ix; ++iy) path[++j]= path[i++];
					for(let iy=0; iy<=ix; ++iy)	path.swap(j-iy-0, j-iy-1);
					break;
				}
			}
			if(!valid_swap) path[--i]= path[j--];
		}

		for(let j= path.length-1; j>=i; --j){
			if(!cell.neighbors[path[j]]) new Dodecagrid(cell, path[j]);
			cell= cell.neighbors[path[j]];
		}
		cell.neighbors[face]= this;
		this.neighbors[face]= cell;
		return cell;
	}
}

Dodecagrid.absorb= function(cell, transform){
	while(1){
		var face= dodecahedron.absorb(transform);
		if(face==-1) break;
		else cell= cell.at(face);
	}
	return cell;
}

Dodecagrid.map= function(root, cell, max_depth, fun){
	let center_cell= root;
	let local_cell= cell;
	let transforms= [new Transform()];
	let i=0;

	fun(local_cell, transforms[0]);
	while(1){
		if(i==12||center_cell.depth==max_depth){
			if(center_cell.root==-1){
				break;
			}
			else{
				i= center_cell.root;
				center_cell= center_cell.at(i);
				local_cell=   local_cell.at(i);
				transforms.pop();
			}
		}
		else{
			let next_cell= center_cell.at(i);
			if(next_cell.root==i){
				center_cell= next_cell;
				local_cell= local_cell.at(i);
				
				transforms.push(transforms[transforms.length-1].product(dodecahedron.transforms[i]));
				
				fun(local_cell, transforms[transforms.length-1]);
				i=-1;
			}
		}
		++i;
	}
}


Array.prototype.swap = function (i,j) {
  var temp = this[i];
  this[i] = this[j];
  this[j] = temp;
  return this;
}