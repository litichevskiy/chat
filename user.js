module.exports = function (storage) {

    storage.createUser({
        password : '111',
        login    : 'Bob'
    });
    storage.createMessage({
        content : 'Hello',
        user    : 'Bob',
        room    : '',
        time    : new Date()
    });
};