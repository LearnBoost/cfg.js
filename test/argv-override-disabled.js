
var cfg = require('../cfg').createConfig({ argv: false });

cfg.set('a', 'b');
cfg.set('with dashes', '2');

cfg.env('production', function () {
  cfg.set('b', 'c');
});

cfg.enable('woot');
cfg.enable('woot woot');
cfg.disable('manny');
cfg.disable('tobi tobi tobi');

console.log(JSON.stringify(cfg.get()));
