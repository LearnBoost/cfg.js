# cfg: Node minimal configuration engine

`cfg` is a minimal configuration API for Node.JS, with support for
environments, inheritance and command-line overrides.

## Features

### Simple API

- _config_
  - **config#createConfig(options)**: creates a configuration file.
    Options can be:
    - **argv**: whether to allow argv overrides (defaults to `true`)
    - **argvPrefix**: prefix for env variable overrides (defaults to no prefix)
    - **env**: whether to allow env var overrides (defaults to `true`)
    - **envPrefix**: prefix for env variable overrides (defaults to `'cfg'`)

- _setters_

  - **cfg#set(obj)**: sets multiple values at once.
  - **cfg#set(flag, value)**: sets a cfg flag to the supplied value.
  - **cfg#unset(flag)**: unsets a flag.
  - **cfg#enable(flag)**: sets a cfg flag to true.
  - **cfg#disable(flag)**: sets a cfg flag to false.

- _getters_

  - **cfg#get()**: gets a hash of all values.
  - **cfg#get(flag)**: gets the value of a cfg flag.
  - **cfg#has(flag)**: checks whether flag is set.
  - **cfg#enabled(flag)**: checks if a cfg flag is true.
  - **cfg#disabled(flag)**: checks if a cfg flag is false.

- _environments_
  - **cfg.env()**: gets the current env (defaults to `development`)
  - **cfg.env(name, fn)**: executes `fn` only if the current env is the same as `name`
  - **cfg.env(name, opts, fn)**: same as previous, but with options.
    Options can be
    - **inherits**: an environment name to inherit props from

### Settings are overrideable from the outside

There's two ways to override settings. Imagine the following configuration:

```js
var cfg = require('cfg').createConfig();

cfg.env('production', function () {
  cfg.enable('my boolean flag');
  cfg.set('my flag', 'woot');
});
```

#### With process argv

```
node index.js --enable-my-boolean-flag
node index.js --disable-my-boolean-flag
node index.js --with-my-flag=value
node index.js --with-my-flag="some value with spaces"
```

If you supply an option `argvPrefix` with the value `'lb'` for example, then
the option becomes `--enable-lb-flag`.

#### With environment variables

```
CFG_MY_BOOLEAN_FLAG=YES node index.js
CFG_MY_FLAG="woot woot" node index.js
```

The prefix `CFG` can be overriden by passing the `envPrefix` option to
`createConfig`.

### No stores or transports

`cfg` is not concerned with what populates configuration. Layers of replication,
pub/sub, etc can be added as a separate module.

Everything is stored in memory, none of the signatures take callbacks

### Reusable

The sweet spot for `cfg` is configuration that you want to reuse across modules
and scripts. Even though projects like `express` or `socket.io` already include 
configuration systems, certain configuration flags such as API keys you might
want to retrieve from a CLI script **and** your web app for example

In summary, keep your web-app related configuration flags in express, and put
those that are generic in `cfg`.

## License 

(The MIT License)

Copyright (c) 2011 Guillermo Rauch &lt;guillermo@learnboost.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
