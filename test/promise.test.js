'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const {expect} = Code;
const lab = Lab.script();

exports.lab = lab;

const P = require('../lib/promise.js');

lab.experiment('Promise', () => {
    lab.test('new P()', () => {
        const value = 100;

        return new P(value).then((results) => {
            expect(results).to.equal(value);
        });
    });

    lab.test('timeout', () => {
        const startTime = new Date().getTime();
        const maxDelta = 10;
        const wait = 400;
        const value = 42;
        let rejected = false;

        return P.timeout(wait, value)
            .catch((results) => {
                const endTime = new Date().getTime();

                expect(endTime - startTime).to.be.within(wait, wait + maxDelta);
                expect(results).to.equal(value);

                rejected = true;
            })
            .then(() => {
                expect(rejected).to.be.true();
            });
    });

    lab.test('delay', () => {
        const startTime = new Date().getTime();
        const maxDelta = 10;
        const wait = 400;
        const value = 42;

        return P.delay(wait, value)
            .then((results) => {
                const endTime = new Date().getTime();

                expect(endTime - startTime).to.be.within(wait, wait + maxDelta);
                expect(results).to.equal(value);
            });
    });

    lab.test('fcall - function call succeeds', () => {
        const a = 11;
        const b = 'hello';
        const c = true;
        const d = 12.345;

        const testFunc = function(arg1, arg2, arg3) {
            expect(arg1).to.equal(a);
            expect(arg2).to.equal(b);
            expect(arg3).to.equal(c);

            return d;
        };

        return P.fcall(testFunc, a, b, c)
            .then((results) => {
                expect(results).to.equal(d);
            });
    });

    lab.test('fcall - function call throws error', () => {
        return P.fcall(() => {
            throw new Error('function failed');
        })
            .then(() => {
                Code.fail('expected an error to be thrown');
            })
            .catch((err) => {
                expect(err).to.be.an.error(Error, 'function failed');
            });
    });

    lab.test('fcall - function call fails', () => {
        const testFunc = 100;

        return P.fcall(testFunc)
            .then(() => {
                Code.fail('expected an error to be thrown');
            })
            .catch((err) => {
                expect(err).to.be.an.error(TypeError, '\'func\' argument must be a function');
            });
    });

    lab.test('nfcall - function call returns success', () => {
        const a = 11;
        const b = 'hello';
        const c = true;
        const d = 12.345;

        const testFunc = function(arg1, arg2, arg3, cb) {
            expect(arg1).to.equal(a);
            expect(arg2).to.equal(b);
            expect(arg3).to.equal(c);

            return cb(null, d);
        };

        return P.nfcall(testFunc, a, b, c)
            .then((results) => {
                expect(results).to.equal(d);
            });
    });

    lab.test('nfcall - function call returns error', () => {
        return P.nfcall((cb) => {
            return cb(new Error('function failed'));
        })
            .then(() => {
                Code.fail('expected an error to be returned');
            })
            .catch((err) => {
                expect(err).to.be.an.error(Error, 'function failed');
            });
    });

    lab.test('nfcall - function call throws error', () => {
        return P.nfcall(() => {
            throw new Error('function failed');
        })
            .then(() => {
                Code.fail('expected an error to be thrown');
            })
            .catch((err) => {
                expect(err).to.be.an.error(Error, 'function failed');
            });
    });

    lab.test('nfcall - function call fails', () => {
        const testFunc = 100;

        return P.nfcall(testFunc)
            .then(() => {
                Code.fail('expected an error to be thrown');
            })
            .catch((err) => {
                expect(err).to.be.an.error(TypeError, '\'func\' argument must be a function');
            });
    });

    lab.test('all', () => {
        expect(P.all).to.equal(Promise.all);
    });

    lab.test('allSettled', () => {
        expect(P.allSettled).to.equal(Promise.allSettled);
    });

    lab.test('race', () => {
        expect(P.race).to.equal(Promise.race);
    });

    lab.test('reject', () => {
        expect(P.reject).to.equal(Promise.reject);
    });

    lab.test('resolve', () => {
        expect(P.resolve).to.equal(Promise.resolve);
    });
});
