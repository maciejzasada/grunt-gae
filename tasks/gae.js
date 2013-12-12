/*
 * grunt-gae
 * https://github.com/maciejzasada/grunt-gae
 *
 * Copyright (c) 2013 Maciej Zasada hello@maciejzasada.com
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Module export.
 * @param grunt
 */
module.exports = function (grunt) {

    // Imports.
    var sys = require('sys'),
        exec = require('child_process').exec,
        format = require('util').format,

    // Constants.
        COMMAND_KILL = 'kill `cat .grunt-gae-pid` && rm -rf .grunt-gae-pid',
        COMMAND_RUN = 'dev_appserver.py {args}{flags}{path}',
        COMMAND_ASYNC = 'nohup {command} >/dev/null 2>&1 & echo $! >> .grunt-gae-pid',
        COMMAND_APPCFG = 'appcfg.py {args}{flags}{auth}{action}{path}',

        FLAG_OAUTH2 = 'oauth2';

    /**
     * Reads authentication file.
     * @param path
     * @returns {null}
     */
    function readAuth (path) {

        var auth;

        if (grunt.file.exists(path)) {

            auth = grunt.file.read(path).split(/\s/);
            if (auth.length === 2 && auth[0].indexOf('@') !== -1) {

                return {email: auth[0], password: auth[1]};

            }

        }

        return null;

    }

    /**
     * Runs GAE command.
     * @param command
     * @param auth
     * @param options
     * @param async
     * @param done
     * @param msgSuccess
     * @param msgSuccessAsync
     * @param msgFailure
     */
    function run(command, auth, options, async, done, msgSuccess, msgSuccessAsync, msgFailure) {

        var args,
            flags,
            field,
            i,
            childProcess;

        // Pass auth.
        command = command.replace('{auth}', auth ? format('--email=%s --passin ', auth.email) : '');

        // Evaluate arguments to pass.
        args = '';
        for (field in options.args) {
            args += format('--%s=%s ', field, options.args[field]);
        }

        // Evaluate flags to pass.
        flags = '';
        for (i = 0; i < options.flags.length; ++i) {
            flags += format('--%s ', options.flags[i]);
        }

        command = command.replace('{args}', args).replace('{flags}', flags).replace('{path}', options.path);

        // Passin.
        if (auth) {
            command = format('echo %s | %s', auth.password, command);
        }

        // Run it asynchronously
        if (async) {
            command = COMMAND_ASYNC.replace('{command}', command);
        }

        grunt.log.debug(command);

        // Run the command.
        childProcess = exec(command, {}, function () {});

        // Listen to output
        if (options.stdout) {
            childProcess.stdout.on('data', function (d) {
                grunt.log.write(d);
            });
        }

        // Listen to errors.
        if (options.stderr) {
            childProcess.stderr.on('data', function (d) {
                grunt.log.error(d);
            });
        }

        // Listen to exit.
        childProcess.on('exit', function (code) {

            if (options.stdout) {
                if (code === 0 && async) {
                    grunt.log.subhead(msgSuccessAsync || 'Unable to determine success of asynchronous operation. For debugging please disable async mode.');
                } else if (code === 0) {
                    grunt.log.ok(msgSuccess || 'Action executed successfully.');
                }
            }
            if (options.stderr && code !== 0) {
                grunt.log.error(msgFailure || 'Error executing the action.');
            }

            done();
        });

    }

    /**
     * Grunt task.
     */
    grunt.registerMultiTask('gae', 'Google App Engine management plugin for Grunt.', function () {

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
                application: null,
                version: null,
                path: '.',
                auth: 'oauth2',
                async: false,
                args: {},
                flags: [],
                stdout: true,
                stderr: true
            }),

            async = options.async || grunt.option('async'),
            kill = grunt.option('kill') || this.data.action === 'kill',
            auth,
            done = this.async();

        // Check if action was specified.
        if (!this.data.action) {
            return grunt.log.error('No action specified.');
        }

        // Handle the action specified
        switch(this.data.action) {
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

                    run(COMMAND_RUN, null, options, async, done, 'Server started', 'Server started asynchronously, unable to determine success of this operation. For debugging please disable async mode.', 'Error starting the server.')
                });

                break;

            default:
                // Every other action is passed to appcfg.py.

                // Prevent async appcfg.py actions
                async = false;

                if (options.auth !== FLAG_OAUTH2 && options.flags.indexOf(FLAG_OAUTH2) === -1) {
                    // Read GAE auth.
                    if (!grunt.file.exists(options.auth)) {
                        return grunt.log.error('Authentication file does not exist.');
                    }
                    auth = readAuth(options.auth);
                    if (!auth) {
                        return grunt.log.error('Invalid authentication file.');
                    }
                }

                // Forward special arguments.
                if (options.application) {
                    options.args.application = options.application;
                }
                if (options.version) {
                    options.args.version = options.version;
                }

                // Forward special flags.
                if (options.auth === FLAG_OAUTH2) {
                    options.flags.push(FLAG_OAUTH2);
                }

                run(COMMAND_APPCFG.replace('{action}', format('%s ', this.data.action)), auth, options, async, done);

                break;

        }

    });
};
