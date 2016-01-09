module.exports = function (storage) {

    storage.createUser({
        password : '111',
        login    : 'Bob'
    });
    storage.createMessage({
        content : '1 Hello',
        user    : 'Bob',
        room    : '',
        time    : new Date()
    });
    storage.createMessage({
        content : '2 vdvvd',
        user    : 'Bob',
        room    : '',
        time    : new Date()
    });
    storage.createMessage({
        content : '3 Hello',
        user    : 'Bob',
        room    : '',
        time    : new Date()
    });
    storage.createMessage({
        content : '4 vdvvd',
        user    : 'Bob',
        room    : '',
        time    : new Date()
    });
    storage.createMessage({
        content : '5 Hello',
        user    : 'Bob',
        room    : '',
        time    : new Date()
    });
    storage.createMessage({
        content : '6 vdvvd',
        user    : 'Bob',
        room    : '',
        time    : new Date()
    });
    storage.createMessage({
        content : '7 vdvvd',
        user    : 'Bob',
        room    : '',
        time    : new Date()
    });
    storage.createMessage({
        content : '8 vdvvd',
        user    : 'Bob',
        room    : '',
        time    : new Date()
    });
    storage.createMessage({
        content : '9 vdvvd',
        user    : 'Bob',
        room    : '',
        time    : new Date()
    });
    storage.createMessage({
        content : '10 vdvvd',
        user    : 'Bob',
        room    : '',
        time    : new Date()
    });
};