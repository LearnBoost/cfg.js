
/**
 * Initialize my config.
 */

var cfg = module.exports = require('cfg').createConfig();

/**
 * General settings
 */

cfg.set('domain name', 'www.google.com');
cfg.set('api key', 'kjahflbh12ui3g12i3vb1j2hv3k123v');
cfg.enable('jquery');

/**
 * Development settings.
 */

cfg.env('development', function () {
  cfg.set({
      'domain name': 'www.yahoo.com'
    , 'api key': 'ojwjqeiqweiqweh'
  });
});

/**
 * Production settings.
 */

cfg.env('production', function () {
  cfg.set('domain name', 'www.production.com');
  cfg.set('api key', 'woot');
});

/**
 * Stage inherits from production.
 */

cfg.env('stage', { inherits: 'production' }, function () {
  cfg.set('api key', 'wooooo');
  cfg.disable('jquery');
});
