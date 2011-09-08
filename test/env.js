
var cfg = require('../cfg').createConfig();

cfg.set('a', 'b');

cfg.env('production', function () {
  cfg.set('a', 'c');
});

console.log(JSON.stringify(cfg.get()));
