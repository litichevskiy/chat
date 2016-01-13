module.exports = function (storage) {
    storage.createUser({
        password : '111',
        login    : 'Bob'
    })
    storage.createMessage({
        content : '1',
        user    : 'Bob',
        room    : 'room_1',
        time    : new Date
    })
	storage.createMessage({
        content : '2',
        user    : 'Bob',
        room    : 'room_1',
        time    : new Date
    })
	storage.createMessage({
        content : '3',
        user    : 'Bob',
        room    : 'room_1',
        time    : new Date
    })
	storage.createMessage({
        content : '4',
        user    : 'Bob',
        room    : 'room_1',
        time    : new Date
    })
	storage.createMessage({
        content : '5',
        user    : 'Bob',
        room    : 'room_1',
        time    : new Date
    })
	storage.createMessage({
        content : '6',
        user    : 'Bob',
        room    : 'room_1',
        time    : new Date
    })
	storage.createMessage({
        content : '7',
        user    : 'Bob',
        room    : 'room_1',
        time    : new Date
    })
	storage.createMessage({
        content : '8',
        user    : 'Bob',
        room    : 'room_1',
        time    : new Date
    })
	storage.createMessage({
        content : '9',
        user    : 'Bob',
        room    : 'room_1',
        time    : new Date
    })
};