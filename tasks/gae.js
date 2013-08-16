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
        format = require('util').format;

    grunt.registerMultiTask('gae', 'Google App Engine deployment plugin for Grunt.', function () {

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
                application: '',
                yaml: 'app.yaml',
                port: 8080,
                admin_port: 8000
            }),
            childProcess,
            action = this.data.action,
            done = this.async();

        // Check if action was specified.
        if (!action) {
            return grunt.log.error('No action specified.');
        }

        // Check if the specified action is correct.
        if (['run', 'deploy'].indexOf(action) === -1) {
            return grunt.log.error(format('%s is not a valid gae action.', action));
        }

        // Handle the action specified
        switch(action) {

            case 'run':
                grunt.log.writeln('RUNNING');
                childProcess = exec('pwd', {}, function () {
                    grunt.log.writeln('callback');
                });
                break;

            case 'deploy':
                grunt.log.writeln('DEPLOYING');
                childProcess = exec('pwd', {}, function () {
                    grunt.log.writeln('callback');
                });
                break;

        }

        childProcess.stdout.on('data', function (d) {
            grunt.log.write(d);
        });
        childProcess.stderr.on('data', function (d) {
            grunt.log.error(d);
        });

        childProcess.on('exit', function (code) {
            if (code !== 0) {
                grunt.log.error(format('Exited with code: %d.', code));
                return done(false);
            }
            grunt.verbose.ok(format('Exited with code: %d.', code));
            done();
        });

        /*
         // Iterate over all specified file groups.
         this.files.forEach(function(f) {
         // Concat specified files.
         var src = f.src.filter(function(filepath) {
         // Warn on and remove invalid source files (if nonull was set).
         if (!grunt.file.exists(filepath)) {
         grunt.log.warn('Source file "' + filepath + '" not found.');
         return false;
         } else {
         return true;
         }
         }).map(function(filepath) {
         // Read file source.
         return grunt.file.read(filepath);
         }).join(grunt.util.normalizelf(options.separator));

         // Handle options.
         src += options.punctuation;

         // Write the destination file.
         grunt.file.write(f.dest, src);

         // Print a success message.
         grunt.log.writeln('File "' + f.dest + '" created.');
         */
    });
};
