
/*!
 * cfg - minimal configuration in node.js
 */

exports.Config = Config;
exports.createConfig = createConfig;

/**
 * Version
 *
 * @api public
 */

exports.version = '0.0.2';

/**
 * Configuration constructor.
 *
 * @param {Object} options
 * @api public
 */

function Config (opts) {
  opts = opts || {};
  opts.envPrefix = opts.envPrefix || 'cfg';
  opts.argvPrefix = opts.argvPrefix || '';
  opts.argv = opts.argv == undefined ? true : opts.argv;
  opts.env = opts.env == undefined ? true : opts.env;

  this.opts = opts;
  this.values = {};
  this.preset = {};
  this.envs = {};
  this.currentEnv = process.env.NODE_ENV || 'development';

  // override with argv
  if (opts.argv) {
    var args = argvOptions(opts.argvPrefix);
    for (var i in args) {
      this.preset[i] = true;
      this.values[i] = args[i];
    }
  }

  // override with env vars
  if (opts.env) {
    var vars = envOptions(opts.envPrefix);
    for (var i in vars) {
      this.preset[i] = true;
      this.values[i] = vars[i];
    }
  }
}

/**
 * Sets a value.
 *
 * @param {Object|String} a hash or a flag name
 * @param {Object} value to set if a flag name is provided
 * @return {Config} for chaining
 * @api public
 */

Config.prototype.set = function (name, value) {
  if ('object' == typeof name) {
    for (var i in name) {
      if (!this.preset[i]) {
        this.values[i] = name[i];
      }
    }
  } else {
    if (!this.preset[name]) {
      this.values[name] = value;
    }
  }

  return this;
};

/**
 * Gets a value.
 *
 * @param {String} flag name (optional)
 * @return {Object|undefined} value(s)
 * @api public
 */

Config.prototype.get = function (name) {
  if (undefined == name) {
    return this.values;
  }

  return this.values[name];
};

/**
 * Unsets a flag.
 *
 * @param {String} flag name
 * @return {Config} for chaining
 * @api public
 */

Config.prototype.unset = function (name) {
  if (!this.preset[name]) {
    delete this.values[name];
  }
  return this;
};

/**
 * Sets a value to true.
 *
 * @param {String} flag name
 * @return {Config} for chaining
 * @api public
 */

Config.prototype.enable = function (name) {
  if (!this.preset[name]) {
    this.values[name] = true;
  }
  return this;
};

/**
 * Sets a value to false.
 *
 * @param {String} flag name
 * @return {Config} for chaining
 * @api public
 */

Config.prototype.disable = function (name) {
  if (!this.preset[name]) {
    this.values[name] = false;
  }
  return this;
};

/**
 * Returns whether a flag is defined.
 *
 * @param {String} flag name
 * @return {Boolean} whether the flag is set
 * @api public
 */

Config.prototype.has = function (name) {
  return name in this.values;
};

/**
 * Returns whether a flag is true (not truthy).
 *
 * @param {String} flag name
 * @return {Boolean} whether the flag is true
 * @api public
 */

Config.prototype.enabled = function (name) {
  return true === this.values[name];
};

/**
 * Returns whether a flag is false (not falsy).
 *
 * @param {String} flag name
 * @return {Boolean} whether the flag is false
 * @api public
 */

Config.prototype.disabled = function (name) {
  return false === this.values[name];
};

/**
 * Returns the env, or sets an env function.
 *
 * @param {String} env name (optional)
 * @param {Object} options (optional)
 * @param {Function} env fn (optional)
 * @return {Config} for chaining
 * @api public
 */

Config.prototype.env = function (name, options, fn) {
  if (undefined == name) {
    return this.currentEnv;
  }

  if ('function' == typeof name) {
    name.call(this);
    return this;
  }

  if ('function' == typeof options) {
    fn = options;
    options = {};
  }

  if (!this.envs[name]) {
    this.envs[name] = [];
  }

  this.envs[name].push(fn);

  if (this.currentEnv == name) {
    // execute inherited first
    if (options.inherits && this.envs[options.inherits]) {
      this.envs[options.inherits].forEach(function (fn) {
        fn.call(this);
      }, this);
    }

    fn.call(this);
  }

  return this;
};

/**
 * Configuration factory.
 *
 * @param {Object} options
 * @api public
 */

function createConfig (options) {
  return new Config(options);
}

/**
 * Parses argv for config options.
 *
 * @param {String} prefix
 * @return {Object}
 * @api private
 */

function argvOptions (prefix) {
  var options = {}
    , argv = process.argv.slice(2)
    , regexp = new RegExp(
            '^'
          + '--(with|disable|enable)-'
          + (prefix ? prefix + '-' : '')
          + '([^=]+)'
          + '(=(.+))?'
          + '$'
      )

  for (var i = 0, l = argv.length; i < l; i++) {
    var match = regexp.exec(argv[i]);
    if (match) {
      var key = match[2].replace(/-/g, ' ').toLowerCase()
        , value = match[4];

      switch (match[1]) {
        case 'with':
          options[key] = value;
          break;

        case 'disable':
          options[key] = false;
          break;

        case 'enable':
          options[key] = true;
          break;
      }
    }
  }

  return options;
}

/**
 * Parses env variables for config options.
 *
 * @param {String} prefix
 * @return {Object}
 * @api private
 */

function envOptions (prefix) {
  var options = {}
    , vars = process.env
    , regexp = new RegExp(
        '^' + (prefix ? prefix.toUpperCase() + '_' : '') + '([^a-z]+)$'
      )

  for (var i in vars) {
    var match = regexp.exec(i);
    if (match) {
      var key = match[1].replace(/_/g, ' ').toLowerCase()
        , value = vars[i];

      if ('YES' === value) {
        value = true;
      } else if ('NO' === value) {
        value = false;
      }

      options[key] = value;
    }
  }

  return options;
}
