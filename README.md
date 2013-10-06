# grunt-gae

[![Build Status](https://travis-ci.org/maciejzasada/grunt-gae.png?branch=dev)](https://travis-ci.org/maciejzasada/grunt-gae)

> Google App Engine management plugin for Grunt.

## About
This plugin provides a way to execute `dev_appserver.py` and `appcfg.py` commands via a Grunt interface.  

Due to its generic nature and support for custom arguments it always stays up to date with latest version of Google App Engine SDK and provides its full functionality.

Some of the possible applications are:
* Starting (also asynchronously) and stopping a local GAE development server
* Deploying your app to Google App Engine
* Deploying to a specific, custom version
* Updating indexes
* Deleting unused indexes
* Updating Task Queue configuration
* Updating the DoS protection configuration
* Managing scheduled tasks

It comes especially handy in conjunction with other Grunt tasks. For example, you can specify to deploy to `dev.your-app.appspot.com` each time a debug build of your code scceeds while deploying to the default `your-app.appspot.com` when your production build is complete.

## Getting Started
This plugin requires Grunt `~0.4.1` and `Google App Engine SDK`.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-gae --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-gae');
```

Google App Engine SDK can be downloaded from [Google App Engine Downloads](https://developers.google.com/appengine/downloads) page.

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
      action: 'action name',
      options: {
        // Target-specific options go here.
      }
    },
  },
})
```

### Actions
The `action` property specifies the Google App Engine task to run.
grunt-gae supports all actions that `appcfg.py` [does](https://developers.google.com/appengine/docs/python/tools/uploadinganapp) plus two custom actions: `run` and `kill`.

#### run
Special action. Runs local Google App Engine development server.

#### kill
Special action. Kills local Google App Engine development server if started asynchronously.

#### update
Deploys the app to Google App Engine.

#### update_indexes
Updates indexes.

#### vacuum_indexes
Deletes unused indexes.

#### update_queues
Updates Task Queue configuration

#### update_dos
Updates the DoS protection configuration

#### update_cron
Manages scheduled tasks specified in `cron.yaml`
  
### Options

#### options.path
Type: `String`
Default value: `'.'`
Required: `yes`

Path to the Google App Engine application root folder (which includes `app.yaml` file).

#### options.application
Type: `String`
Default value: `null`
Required: `no`

Application name. Determines deployment target.
If `null`, value specified in `app.yaml` will be used.

#### options.version
Type: `String`
Default value: `null`
Required: `no`

Application version name. Determines to which version the code will be deployed.
E.g. when `version: 'dev'` code will be deployed to `dev.your-app.appspot.com`.
If `null`, code will be deployed to default version, i.e. `your-app.appspot.com`.

#### options.auth
Type: `String`
Default value: `'oauth2'`
Required: `yes, except for 'run' and 'kill' actions.`

Enables OAuth2 if the value is `'oauth2'`, otherwise path to a `gae.auth` file with app developer / admin credentials.
The file format is:
`name@domain.com password`  
*IMPORTANT: please always add that file to .gitignore to ensure its confidentiality.*  
*OAuth2 NOTE: you need to be logged in with your applications administrator account in your default browser for OAuth2 to work.*

#### options.async
Type: `Boolean`
Default value: `false`
Required: `no`

Specifies whether the action should be executed synchronously or asynchronously.
Currently supported only for the `run` action.

#### options.args
Type: `Object`
Default value: `{}`

Additional command line arguments passed to Google App Engine scripts when executing the task.
A full list of arguments can be found:
* for `run` action: https://developers.google.com/appengine/docs/python/tools/devserver#Python_Command-line_arguments
* for other actions: https://developers.google.com/appengine/docs/python/tools/uploadinganapp#Python_Command-line_arguments

E.g. specifying:
```
options: {
  args: {
    host: '0.0.0.0'
  }
}
```
will result in appending `--host=0.0.0.0` to the executed GAE command.


#### options.flags
Type: `Array`
Default value: `[]`

Additional command line flags (value-less) passed to Google App Engine scripts when executing the task.
A full list of flags can be found:
* for `run` action: https://developers.google.com/appengine/docs/python/tools/devserver#Python_Command-line_arguments
* for other actions: https://developers.google.com/appengine/docs/python/tools/uploadinganapp#Python_Command-line_arguments

E.g. specifying:
```
options: {
  flags: [
    'no_cookies'
  ]
}
```
will result in appending `--no_cookies` to the executed GAE command.

### Usage Examples

#### Running local Google App Engine development server synchronously.
This example task starts local Google App Engine development server synchronously. It means that until the server's log messages will appear in console and until the server is stopped, no further Grunt tasks will execute.

```js
grunt.initConfig({
  gae: {
    run_sync: {
      action: 'run'
    }
  }
});
```

#### Running local Google App Engine development server asynchronously.
This example task starts local Google App Engine development server asynchronously. It means that no server logs will be shown in the console and Grunt will immediately proceed to executing next tasks in the queue. It also means that it will not be possible to determine if the development server started successfully other than by trying to access it via its local address in the browser. If for some reason the server does not start, temporarly make the action synchronous for debugging.

```js
grunt.initConfig({
  gae: {
    run_async: {
      action: 'run',
      options: {
        async: true
      }
    }
  }
});
```

#### Running local Google App Engine development server on a non-standard port.
By default local GAE dev server starts on port `8080`. According to [dev_appserver.py documentation](https://developers.google.com/appengine/docs/python/tools/devserver#Python_Command-line_arguments) it is possible to run the server on a differnt port by specifying a `--port=...` flag. As every other flag, this can be done by adding `port` to the `args` object in `options`:

```js
grunt.initConfig({
  gae: {
    run_async_port9999: {
      action: 'run',
      options: {
        async: true,
        args: {
          port: 9999
        }
      }
    }
  }
});
```

#### Stopping local Google App Engine development server that was started asynchronously.
If local GAE dev server has been started asynchronously, it can be stopped with the following task:

```js
grunt.initConfig({
  gae: {
    stop: {
      action: 'kill'
    }
  }
});
```

#### Deploying the code to a default version
*Deploying to Google App Engine requires being logged in with the application's administrator account in the default web browser, or a valid `gae.auth` file for non-OAuth2 transactions (please see options section above).*  
The following task will deploy the code to default Google App Engine instance (i.e. `your-app.appspot.com`) using OAuth2:

```js
grunt.initConfig({
  gae: {
    deploy_default: {
      action: 'update'
    }
  }
});
```

#### Deploying the code to a specific non-default version
*Deploying to Google App Engine requires being logged in with the application's administrator account in the default web browser, or a valid `gae.auth` file for non-OAuth2 transactions (please see options section above).*  
The following task will deploy the code to `dev` Google App Engine instance (i.e. `dev.your-app.appspot.com`) reading the authentication credentials from `'gae.auth'` file:

```js
grunt.initConfig({
  gae: {
    deploy_dev: {
      action: 'update',
      options: {
        auth: 'gae.auth',
        version: 'dev'
      }
    }
  }
});
```

#### Deploying the code to a different application
*Deploying to Google App Engine requires being logged in with the application's administrator account in the default web browser, or a valid `gae.auth` file for non-OAuth2 transactions (please see options section above).*  
The following task will deploy the code to Google App Engine application different than the one specified either in global options or in `app.yaml`:

```js
grunt.initConfig({
  gae: {
    deploy_different_app: {
      action: 'update',
      options: {
        application: 'grunt-gae-another-app'
      }
    }
  }
});
```

#### Updating indexes
*Updating indexes requires being logged in with the application's administrator account in the default web browser, or a valid `gae.auth` file for non-OAuth2 transactions (please see options section above).*  
The following task will update indexes of `grunt-gae-another-app` application.

```js
grunt.initConfig({
  gae: {
    update_indexes: {
      action: 'update_indexes',
      options: {
        application: 'grunt-gae-another-app'
      }
    }
  }
});
```


#### Rolling back transaction.
*Rolling back transaction requires being logged in with the application's administrator account in the default web browser, or a valid `gae.auth` file for non-OAuth2 transactions (please see options section above).*  
The following task will rollback the current transaction.

```js
grunt.initConfig({
  gae: {
    update_indexes: {
      action: 'rollback',
    }
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Reporting issues
Please report all issues directly on the [Github Issues](https://github.com/maciejzasada/grunt-gae/issues) page.  
Whenever reporting an issue, please run the task in which you can observe a bug with a `--debug` flag, e.g. `grunt gae:your_buggy_task --debug` and include full output from your console.

## Release History
 * 2013-10-06   v0.2.0   Flags added, OAuth2 support added.
 * 2013-08-17   v0.1.0   Initial release.

[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/09f9aacdf9d835d771e7fe90f8495eba "githalytics.com")](http://githalytics.com/maciejzasada/grunt-gae)
[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/5fe337c7298ecdd5a70182701804cd18 "githalytics.com")](http://githalytics.com/maciejzasada/grunt-gae)
