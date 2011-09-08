
var cfg = require('../cfg').createConfig({ argvPrefix: 'lb' });

cfg.set('woot woot', 'a');

console.log(JSON.stringify(cfg.get()));
