const fs = require('fs');
const FILE_PATH = './log/';

exports.log = (subject, calledBy, message, detail) => {
    const date = moment().format('YYYY-MM-DD');
        const path = FILE_PATH + date + '.log';

        const time = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
        const _message = (typeof message === 'object') ? JSON.stringify(message) : message;
        const _detail = (typeof detail === 'object') ? JSON.stringify(detail) : detail;
        const data = `${subject || ''}  ${time}  [${calledBy || ''}] ${_message || ''}${_detail ? ' - ' + _detail : ''}`;

        fs.appendFileSync(path, data + "\n");
        console.log(data);
}

exports.subjects = {
    info: 'INFO',
    error: 'ERROR',
    warn: 'WARN',
    debug: 'DEBUG'
};