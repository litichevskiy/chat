(function(exports){

	function PubSub ( ) {
		this.storage = {};
	};

	PubSub.prototype.Subscribe = function( eventName, func ){
		if ( !this.storage.hasOwnProperty( eventName ) ){

			this.storage[eventName] = [];
			this.storage[eventName].push( func );
		}
	};

	PubSub.prototype.Publish = function( eventName, data ){
		( this.storage[eventName] || [] ).forEach( function( func ){

				func( data )
			});
	};

	PubSub.prototype.UnSubscribe = function( eventName, func ){
		var index = this.storage[eventName].indexOf( func );

		if ( index > -1 ){

			this.storage[eventName].splice( index, 1  )
		};
	};

	window.PubSub = PubSub;
})(window);