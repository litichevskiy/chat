module.exports = function (storage) {
    storage.createUser({
        password : 'Bob',
        login    : '111'
    })
    storage.createMessage({
        content : '1',
        user    : 'Bob',
        room    : 'room_1',
        time    : new Date
    })
};