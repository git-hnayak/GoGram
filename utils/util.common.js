const fs = require('fs');

const removeFile = (path) => {
    fs.unlink(path, (err) => {
        if (err) console.log(err);
        console.log('successfully deleted file', path);
    });
}

module.exports = {
    removeFile: removeFile
}