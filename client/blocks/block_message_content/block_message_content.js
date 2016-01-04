(function(exports){

	function BlockMessage ( o ) {

		var that = this;

		this.container = $('<ul class="list-unstyled list_message"></ul>');
		o.append(this.container);
	};


	BlockMessage.prototype.update = function( list ) {

		var listMassage='';

		list.forEach(function( data ){
			listMassage += '<li>"'+data.content+'"</li>'
		});

		this.container.html( listMassage );
	}

	BlockMessage.prototype.Get = function(){
		serverStorage.getMessage({

			quantity : '20',
			room     : '111',
			fromId   : ''

		}, blockMessage.update.bind(this) )
	}

	window.BlockMessage = BlockMessage;

})(window);