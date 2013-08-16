/*
 * grunt-gae
 * https://github.com/maciejzasada/grunt-gae
 *
 * Copyright (c) 2013 Maciej Zasada
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    var sys = require('sys'),
        exec = require('child_process').exec,
        format = require('util').format,

        COMMAND_KILL = 'kill $(< .grunt-gae-pid) && rm -rf .grunt-gae.pid',
        COMMAND_RUN = 'dev_appserver.py {args}{path}',
        COMMAND_ASYNC = 'nohup {command} >/dev/null 2>&1 & echo $! >> .grunt-gae-pid',
        COMMAND_APPCFG = 'appcfg.py {args}{action} {path}';

    grunt.registerMultiTask('gae', 'Google App Engine deployment plugin for Grunt.', function () {

        // Check if action was specified.

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
                application: '',
                auth: 'gae.auth',
                path: '.',
                args: {},
                async: false,
                stdout: true,
                stderr: true
            }),
            childProcess,
            action = this.data.action,
            async = options.async || grunt.option('async'),
            kill = grunt.option('kill') || action === 'kill',
            args,
            command,
            field,
            run,
            done = this.async();

        // Check if action was specified.
        if (!action) {
            return grunt.log.error('No action specified.');
        }

        // Prepare the run code.
        run = function (callback) {

            // Run the command.
            childProcess = exec(command, {}, function () {});

            // Listen to output
            if (options.stdout) {
                childProcess.stdout.on('data', function (d) {
                    grunt.log.write(d);
                });
            }

            if (options.stderr) {
                childProcess.stderr.on('data', function (d) {
                    grunt.log.error(d);
                });
            }

            // Listen to exit.
            childProcess.on('exit', function (code) {

                if (callback) {
                    callback(code);
                }

                done();
            });

        };

        // Evaluate arguments to pass.
        args = '';
        for (field in options.args) {
            args += format('--%s=%s ', field, options.args[field]);
        }

        // Handle the action specified
        switch(action) {

            case 'run':
            case 'kill':
                // Kill running servers first.
                exec(COMMAND_KILL, {}, function () {}).on('exit', function (code) {

                    // If the task is killed only, do not do anything else.
                    if (code === 0) {
                        if (options.stdout) {
                            grunt.log.writeln('Server killed.');
                        }
                    }

                    if (kill) {
                        if (code !== 0) {
                            if (options.stderr) {
                                grunt.log.error('Server not running. Nothing to kill.');
                            }
                        }
                        return done();
                    }

                    // Compile the command
                    command = COMMAND_RUN.replace('{args}', args).replace('{path}', options.path);

                    // Run it asynchronously
                    if (async) {
                        command = COMMAND_ASYNC.replace('{command}', command);
                    }

                    grunt.log.writeln(command);

                    run(function (code) {
                        if (options.stdout) {
                            if (code === 0 && async) {
                                grunt.log.warn('Server started asynchronously, unable to determine success of this operation. For debugging please disable async mode.');
                            } else if (code === 0) {
                                grunt.log.writeln('Server started');
                            }
                        }
                        if (options.stderr && code !== 0) {
                            grunt.log.error('Error starting the server.');
                        }
                    });
                });

                break;

            default:
                grunt.log.writeln('appcfg.py');
                command = COMMAND_APPCFG.replace('{args}', args).replace('{action}', action).replace('{path}', options.path);
                grunt.log.writeln(command);
                break;

        }

    });
};
