(function(exports){

	$.get('/views/messageTemplate.jade')
	.then(function( template ){
		BlockMessage.prototype.render = jade.compile( template )
	})
	.fail(function(err){console.log(err)})


	function BlockMessage ( htmlElement ) {

		var that = this;

		this.container = $('<ul class="list-unstyled list_message"></ul>');
		htmlElement.append(this.container);
	};


	BlockMessage.prototype.addMessage = function( data ) {

		var that = this,
			listMassage = '',
			html = $(that.container).html();

			listMassage += that.render({

				id      : data.id,
				name    : data.user,
				content : data.content,
				time    : data.time
			});

		that.container.html( html + listMassage );
	};

	BlockMessage.prototype.addMessages = function ( list ) {

		var that = this,
		listMassage = '',
		html = $(this.container).html();

		list.forEach(function(data){

			listMassage += that.render({

				id      : data.id,
				name    : data.user,
				content : data.content,
				time    : data.time
			})
		});

		that.container.html( html + listMassage );
	};

	// BlockMessage.prototype.getMessage = function(){
	// 	serverStorage.getMessage({

	// 		quantity : '20',
	// 		room     : '111',
	// 		fromId   : ''

	// 	}, blockMessage.update.bind(this) )
	// }

	window.BlockMessage = BlockMessage;

})(window);