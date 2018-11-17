const fs = require('fs');
const FILE_PATH = './log/';

exports.log = (subject, calledBy, _content) => {
    const date = moment().format('YYYY-MM-DD');
        const path = FILE_PATH + date + '.log';

        const time = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
        const content = (typeof _content === 'object') ? JSON.stringify(_content) : _content;
        const data = `${subject || ''}  ${time}  [${calledBy || ''}] ${content || ''}`;

        fs.appendFileSync(path, data + "\n");
        console.log(data);
}

exports.subjects = {
    info: 'INFO',
    error: 'ERROR',
    warn: 'WARN',
    debug: 'DEBUG'
};