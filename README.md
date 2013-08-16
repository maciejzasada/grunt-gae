# grunt-gae

[![Build Status](https://travis-ci.org/maciejzasada/grunt-gae.png?branch=dev)](https://travis-ci.org/maciejzasada/grunt-gae)

> Google App Engine deployment and run plugin for Grunt.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-gae --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-gae');
```

## The "gae" task

### Overview
In your project's Gruntfile, add a section named `gae` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  gae: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific options go here.
    },
  },
})
```

### Options

#### options.application
Type: `String`
Default value: `''`

Application name. Determines deployment target.

#### options.auth
Type: `String`
Default value: `'gae.auth'`

Path to a gae.auth file with app developer / admin credentials.
The file format is:
`name@domain.com password`  
IMPORTANT: please always add that file to .gitignore to ensure its confidentiality.

#### options.path
Type: `String`
Default value: `'.'`

Path to the Google App Engine application root (which includes app.yaml file).

#### options.args
Type: `Object`
Default value: `{}`

Additional command line arguments passed to Google App Engine scripts when executing the task.
A full list of arguments can be found:
* for `run` action: https://developers.google.com/appengine/docs/python/tools/devserver#Python_Command-line_arguments
* for other actions: https://developers.google.com/appengine/docs/python/tools/uploadinganapp#Python_Command-line_arguments

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  gae: {
    options: {},
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
})
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  gae: {
    options: {
      separator: ': ',
      punctuation: ' !!!',
    },
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
