const { readFile, writeFile } = require('../helper/file.helper');
const path = require('path');

const PATH = path.join(__dirname, '..', 'data', 'user.data.json');

var findAll = function () {
    return readFile(PATH);
}


var findByUsername = async function (username) {

    var users = await readFile(PATH);
    if (users[username]) {
        return users[username];
    }
}


var checkUsername = async function (username) {
    var users = await readFile(PATH);
    if (users[username.toLowerCase()]) {
        return true;
    }
    return false;
}


var create = async function (user) {
    var users = await readFile(PATH);
    users[user.username] = user;
    return writeFile(PATH, users);
}

module.exports = {
    findAll,
    findByUsername,
    checkUsername,
    create
};