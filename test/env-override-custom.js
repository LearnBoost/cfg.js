
var cfg = require('../cfg').createConfig({ envPrefix: 'lbb' });

cfg.set('woot woot', 'a');

console.log(JSON.stringify(cfg.get()));
