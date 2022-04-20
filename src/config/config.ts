import prefix from 'loglevel-plugin-prefix';

let option = {
    defaults: {
        template: '[%t] %l:',
        levelFormatter: function (level: any) {
            return level.toUpperCase();
        },
        nameFormatter: function (name: any) {
            return name || 'root';
        },
        timestampFormatter: function (date: any) {
            return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
        }
    }
}

export const log = require('loglevel');

log.enableAll();
prefix.reg(log);
prefix.apply(log, option.defaults);

