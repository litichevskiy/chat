(function(exports){

	var parentBlockMessage = $('.column')[1],
		render;

	function init () {
		var defer = $.Deferred();

		$.get('/views/messageTemplate.jade')
		.then(function( template ){
			render = jade.compile( template )
			defer.resolve();
		})
		.fail(function(err){
			console.log(err)
		})
		return defer.promise();
	};


	function BlockMessage ( htmlElement ) {

		var that = this;

		this.container = $('<ul class="list-unstyled list_message"></ul>');
		$(htmlElement).append(this.container);
		this.render;
	};


	BlockMessage.prototype.addMessage = function( data ) {

		var that = this,
			newHtml = '';

			lastElemList = $(that.container).find('li:last')[0] || $(that.container);
			html = $(lastElemList).html();

			newHtml = render({

				id      : data.id || '',
				name    : data.user,
				content : data.content,
				time    : data.time
			});

			$(lastElemList).html( html + newHtml )
			scrollInBottom();
	};

	BlockMessage.prototype.addMessages = function ( list ) {

		var that = this,
		listMassage = '',
		html = $(this.container).html();

		list.forEach(function(data){

			listMassage += render({

				id      : data.id || '',
				name    : data.user,
				content : data.content,
				time    : data.time
			})
		});

		$(that.container).html( listMassage + html );
		scrollInBottom();
	};

	function scrollInBottom ( ) {
		parentBlockMessage.scrollTop = parentBlockMessage.scrollHeight;
	};

	exports.BlockMessage = BlockMessage;
	exports.init = init;

})(window);