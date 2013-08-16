'use strict';

var grunt = require('grunt');

/*
 ======== A Handy Little Nodeunit Reference ========
 https://github.com/caolan/nodeunit

 Test methods:
 test.expect(numAssertions)
 test.done()
 Test assertions:
 test.ok(value, [message])
 test.equal(actual, expected, [message])
 test.notEqual(actual, expected, [message])
 test.deepEqual(actual, expected, [message])
 test.notDeepEqual(actual, expected, [message])
 test.strictEqual(actual, expected, [message])
 test.notStrictEqual(actual, expected, [message])
 test.throws(block, [error], [message])
 test.doesNotThrow(block, [error], [message])
 test.ifError(value)
 */

exports.gae = {
    setUp: function (done) {
        // setup here if necessary
        done();
    },
    run_default: function (test) {
        test.expect(1);

//    var actual = grunt.file.read('tmp/default_options');
//    var expected = grunt.file.read('test/expected/default_options');
//    test.equal(actual, expected, 'should describe what the default behavior is.');
        test.equal(1, 1, 'TODO: implement the test');

        test.done();
    },
    run_custom: function (test) {
        test.expect(1);

//    var actual = grunt.file.read('tmp/custom_options');
//    var expected = grunt.file.read('test/expected/custom_options');
//    test.equal(actual, expected, 'should describe what the custom option(s) behavior is.');
        test.equal(1, 1, 'TODO: implement the test');

        test.done();
    },
    deploy_default: function (test) {
        test.expect(1);
        test.equal(1, 1, 'TODO: implement the test');
        test.done();
    },
    deploy_custom: function (test) {
        test.expect(1);
        test.equal(1, 1, 'TODO: implement the test');
        test.done();
    }
};
