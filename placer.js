var placer= (function(){

	var q= quat.create();
	var dims= [[-.1,-.1,-.1],[+.1,+.1,+.1]];
	var dimsSensitivity=.001;
	var activeAxis= 0;
	var activeSide= 0;

	var isActive= 0;


	function nextAxis(){
		this.activeAxis= (this.activeAxis+1)%3;
	}
	function oppositeSide(){
		this.activeSide= 1-this.activeSide;
	}

	function adjustDims(v){
		this.dims[this.activeSide][this.activeAxis]+= v;
	}

	function begin(){
		v4.copy(v4.W, q);
		this.isActive= 1;
	}
	function end(){
		this.isActive= 0;
	}

	return {
		q: q,
		dims: dims,
		dimsSensitivity: dimsSensitivity,
		activeAxis: activeAxis,
		activeSide: activeSide,
		adjustDims: adjustDims,
		nextAxis: nextAxis,
		oppositeSide: oppositeSide,
		isActive: isActive,
		begin: begin,
		end: end
	};

}());

