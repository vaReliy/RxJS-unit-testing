import {serveWebpackBrowser} from '@angular-devkit/build-angular/src/dev-server';
import {cold} from 'jasmine-marbles';
import {asyncScheduler, of} from 'rxjs';
import {VeryImportantServiceTS} from '../mine_services/3. very-important.service.TestScheduler';
import {TestScheduler} from 'rxjs/testing';

xdescribe('Module 7: VeryImportantServiceTS (with TestScheduler.run)', () => {
  let service;
  let mockHttp;

  beforeEach(() => {
    mockHttp = {get: () => of(42, asyncScheduler)};

    service = new VeryImportantServiceTS(mockHttp);
  });

  describe('getRangeASAP (with trick and marbles)', () => {
    it('should emit 4 specific values (implicit AsyncScheduler.delegate)', () => {

      const assertion = (actual, expected) => {
        expect(actual).toEqual(expected);
      };

      const scheduler = new TestScheduler(assertion);

      scheduler.run(helpers => {
        const marbleValues = {a: 0, b: 1, c: 2, d: 3};
        const expected = '(abcd|)';
        helpers.expectObservable(service.getRangeASAP()).toBe(expected, marbleValues);
      });

      // create TestScheduler instance
      // write test in scheduler.run callback
      // const marbleValues = {a: 0, b: 1, c: 2, d: 3};
      // const expectedMarble = '(abcd|)';
      // use expectObservable helper for assertion


    });
  });

  describe('getData (TestScheduler.run with marbles)', () => {
    it('should emit 3 values', () => {
      const assertion = (actual, expected) => {
        expect(actual).toEqual(expected);
      };

      const scheduler = new TestScheduler(assertion);

      scheduler.run(helpers => {
        // tslint:disable-next-line:no-shadowed-variable
        const { cold, expectObservable } = helpers;
        const marbleValues = { a: 42 };
        service.http = {
          get: () => cold('(a|)', marbleValues),
        };

        // const expected = 'a 1000ms a 1000ms (a|)';
        const expected = 'a 999ms a 999ms (a|)';
        expectObservable(service.getData(1)).toBe(expected, marbleValues);
      });

      // create TestScheduler instance
      // write test in scheduler.run callback
      // mock service.http with cold helper function cold('(a|)', marbleValues)
      // compose expected marble string
      // use expectObservable helper for assertion

    });
  });
});
