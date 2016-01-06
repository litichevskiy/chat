(function(exports){

	var parentBlockMessage = $('.column')[1];

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

		var that = this;

			lastElemList = $(that.container).find('li:last')[0];

			lastElemList.innerHTML += that.render({

				id      : data.id || '',
				name    : data.user,
				content : data.content,
				time    : data.time
			});

			scrollInBottom();
	};

	BlockMessage.prototype.addMessages = function ( list ) {

		var that = this,
		listMassage = '',
		html = $(this.container).html();

		list.forEach(function(data){

			listMassage += that.render({

				id      : data.id || '',
				name    : data.user,
				content : data.content,
				time    : data.time
			})
		});

		that.container.html( listMassage + html );
		scrollInBottom();
	};

	function scrollInBottom ( ) {
		parentBlockMessage.scrollTop = parentBlockMessage.scrollHeight;
	};

	window.BlockMessage = BlockMessage;

})(window);