/*
 * grunt-gae
 * https://github.com/maciejzasada/grunt-gae
 *
 * Copyright (c) 2013 Maciej Zasada hello@maciejzasada.com
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        // Configuration to be run (and then tested).
        gae: {

            // Global options. Shared across all subtasks.
            options: {
                application: 'grunt-gae-test',
                path: 'app/',
                auth: 'gae.auth'
            },

            run_sync: {
                action: 'run'
            },

            run_async: {
                action: 'run',
                options: {
                    async: true
                }
            },

            run_async_port9999: {
                action: 'run',
                options: {
                    async: true,
                    args: {
                        port: 9999
                    }
                }
            },

            stop: {
                action: 'kill'
            },

            deploy_default: {
                action: 'update'
            },

            deploy_dev: {
                action: 'update',
                options: {
                    version: 'dev'
                }
            },

            deploy_different_app: {
                action: 'update',
                options: {
                    application: 'grunt-gae-another-app'
                }
            },

            deploy_oauth: {
                action: 'update',
                options: {
                    auth: 'oauth2',
                    flags: ['no_cookies']
                }
            },

            deploy_oauth_flag: {
                action: 'update',
                options: {
                    auth: null,
                    flags: ['oauth2', 'no_cookies']
                }
            },

            rollback: {
                action: 'rollback'
            }

        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', /*'gae',*/ 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
