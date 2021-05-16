const fs = require('fs').promises;


exports.readFile = async function (path) {
    var data = await fs.readFile(path);
    return JSON.parse(data.toString());
}



exports.writeFile = async function (path, data) {
    return fs.writeFile(path, JSON.stringify(data));
}