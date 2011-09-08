
/**
 * Module dependencies.
 */

var config = require('../cfg')
  , should = require('should')
  , exec = require('child_process').exec

/**
 * Executes a child process test and parses out response.
 */

function run (cmd, fn) {
  exec(cmd, function (err, stdout) {
    if (err) return fn(err);
    fn(null, JSON.parse(stdout));
  });
}

/**
 * Tests.
 */

module.exports = {

  'ensure an instance of Config is returned': function () {
    config.createConfig().should.be.an.instanceof(config.Config);
  },

  'set(obj)': function () {
    var cfg = config.createConfig();
    cfg.set({
        a: '1'
      , b: 2
    });

    cfg.get('a').should.equal('1');
    cfg.get('b').should.equal(2);
  },

  'set(flag, value)': function () {
    var cfg = config.createConfig();
    cfg.set('a', 'b');
    cfg.set('b', 'c');

    cfg.get('a').should.equal('b');
    cfg.get('b').should.equal('c');
  },

  'unset(flag)': function () {
    var cfg = config.createConfig();
    cfg.set('a', 'b');
    cfg.get('a').should.equal('b');
    cfg.unset('a');
    should.strictEqual(cfg.get('a'), undefined);
  },

  'enable(flag)': function () {
    var cfg = config.createConfig();
    cfg.enable('a');
    cfg.get('a').should.be.true;
  },

  'disable(flag)': function () {
    var cfg = config.createConfig();
    cfg.disable('a');
    cfg.get('a').should.be.false;
  },

  'get()': function () {
    var cfg = config.createConfig();
    cfg.set('a', 'b');
    cfg.enable('b');
    cfg.set('c', 'd');
    cfg.set('d', 'e');
    cfg.unset('d');
    cfg.get().should.eql({
        a: 'b'
      , b: true
      , c: 'd'
    });
    should.strictEqual(cfg.get().d, undefined);
  },

  'has(flag)': function () {
    var cfg = config.createConfig();
    cfg.set('a', 'b');
    cfg.enable('c');
    cfg.disable('d');
    cfg.set('b', 'c');
    cfg.unset('b');

    cfg.has('a').should.be.true;
    cfg.has('c').should.be.true;
    cfg.has('d').should.be.true;
    cfg.has('b').should.be.false;
  },

  'enabled(flag)': function () {
    var cfg = config.createConfig();
    cfg.enable('a');
    cfg.disable('b');
    cfg.enabled('a').should.be.true;
    cfg.enabled('b').should.be.false;
  },

  'disabled(flag)': function () {
    var cfg = config.createConfig();
    cfg.enable('a');
    cfg.disable('b');
    cfg.disabled('a').should.be.false;
    cfg.disabled('b').should.be.true;
  },

  'env()': function () {
    var cfg = config.createConfig();
    cfg.env().should.equal('development');
  },

  'env(fn)': function () {
    var cfg = config.createConfig();
    cfg.env(function () {
      cfg.set('woot woot', 'woot');
    });
    cfg.get('woot woot').should.eql('woot');
  },


  'env(name, fn)': function () {
    var cfg = config.createConfig();
    cfg.env('development', function () {
      cfg.set('woot woot', 'woot');
    });
    cfg.get('woot woot').should.eql('woot');
  },

  'env callback bound': function () {
    var cfg = config.createConfig();
    cfg.env(function () {
      this.set('a', 'woot');
    });
    cfg.env('development', function () {
      this.set('woot woot', 'woot');
    });
    cfg.get('a').should.eql('woot');
    cfg.get('woot woot').should.eql('woot');
  },

  'env inheritance': function () {
    var cfg = config.createConfig();
    cfg.env('woot', function () {
      cfg.enable('a');
      cfg.set('b', 'c');
    });
    cfg.env('development', { inherits: 'woot' }, function () {
      cfg.set('b', 'd');
    });
    cfg.enabled('a').should.be.true;
    cfg.get('b').should.equal('d');
  },

  'NODE_ENV': function (done) {
    run(
          'NODE_ENV=production '
        + 'node ' + __dirname + '/env.js '
      , function (err, obj) {
          if (err) throw err;
          obj.should.eql({
              a: 'c'
          });
          done();
        }
    );
  },

  'argv override': function (done) {
    run(
          'NODE_ENV=production '
        + 'node ' + __dirname + '/argv-override.js '
        + '--with-a=c '
        + '--with-b="some string d" '
        + '--with-with-dashes=2 '
        + '--disable-woot '
        + '--disable-woot-woot '
        + '--enable-manny '
        + '--enable-tobi-tobi-tobi '
      , function (err, obj) {
          if (err) throw err;
          obj.should.eql({
              a: 'c'
            , b: 'some string d'
            , 'with dashes': '2'
            , woot: false
            , 'woot woot': false
            , manny: true
            , 'tobi tobi tobi': true
          });
          done();
        }
    );
  },

  'argv override custom': function (done) {
    run(
          'NODE_ENV=production '
        + 'node ' + __dirname + '/argv-override-custom.js '
        + '--with-lb-a=c '
        + '--with-b="some string d" '
        + '--enable-b '
        + '--enable-lb-woot '
      , function (err, obj) {
          if (err) throw err;
          obj.should.eql({
              a: 'c'
            , 'woot woot': 'a'
            , woot: true
          });
          done();
        }
    );
  },

  'argv override disabled': function (done) {
    run(
          'node ' + __dirname + '/argv-override-disabled.js '
        + '--with-a=c '
        + '--with-b="some string d" '
        + '--disable-woot '
        + '--disable-woot-woot '
        + '--enable-manny '
        + '--enable-tobi-tobi-tobi '
      , function (err, obj) {
          if (err) throw err;
          obj.should.eql({
              a: 'b'
            , 'with dashes': '2'
            , 'woot': true
            , 'woot woot': true
            , 'manny': false
            , 'tobi tobi tobi': false
          });
          done();
        }
    );
  },

  'env vars override': function (done) {
    run(
          'NODE_ENV=production '
        + 'CFG_A=c '
        + 'CFG_WOOT_WOOT="d d d" '
        + 'CFG_WOOT_WOOT_WOOT=b '
        + 'CFG_WOOT=NO '
        + 'node ' + __dirname + '/env-override.js '
      , function (err, obj) {
          if (err) throw err;
          obj.should.eql({
              a: 'c'
            , 'woot woot': 'd d d'
            , 'woot woot woot': 'b'
            , woot: false
          });
          done();
        }
    );
  },

  'env vars override disabled': function (done) {
    run(
          'NODE_ENV=production '
        + 'CFG_A=c '
        + 'CFG_WOOT_WOOT="d d d" '
        + 'CFG_WOOT_WOOT_WOOT=b '
        + 'CFG_WOOT=NO '
        + 'node ' + __dirname + '/env-override-disabled.js '
      , function (err, obj) {
          if (err) throw err;
          obj.should.eql({
              'woot woot': 'b'
            , 'woot woot woot': 'a'
          });
          done();
        }
    );
  },

  'env vars override custom': function (done) {
    run(
          'NODE_ENV=production '
        + 'LBB_MY_FLAG=woot '
        + 'LBB_CUSTOM=NO '
        + 'LBB_CUSTOM_TRUE=YES '
        + 'LBB_WOOT_WOOT_WOOT=wo '
        + 'node ' + __dirname + '/env-override-custom.js '
      , function (err, obj) {
          if (err) throw err;
          obj.should.eql({
              'my flag': 'woot'
            , 'custom': false
            , 'custom true': true
            , 'woot woot': 'a'
            , 'woot woot woot': 'wo'
          });
          done();
        }
    );
  }

};
