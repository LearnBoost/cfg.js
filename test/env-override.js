
var cfg = require('../cfg').createConfig();

cfg.set('woot woot', 'b');
cfg.set('woot woot woot', 'a');

console.log(JSON.stringify(cfg.get()));
