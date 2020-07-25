import {TestBed} from '@angular/core/testing';

import {asyncScheduler, of} from 'rxjs';
import {AsyncScheduler} from 'rxjs/internal/scheduler/AsyncScheduler';
import {TestScheduler} from 'rxjs/testing';
import {HttpClient} from '@angular/common/http';
import {VeryImportantServiceTS} from '../mine_services/3. very-important.service.TestScheduler';

xdescribe('Module-4: VeryImportantService - with TestScheduler', () => {
  let service;
  let mockHttp;

  beforeEach(() => {
    mockHttp = {get: () => of(42, asyncScheduler)};
    TestBed.configureTestingModule({
      providers: [
        {provide: HttpClient, useValue: mockHttp}
      ]
    });
    service = TestBed.inject(VeryImportantServiceTS);
  });

  describe('getData (use TestScheduler as VirtualTimeScheduler)', () => {
    it('should emit 3 specific values', () => {
      const assertion = (actual, expected) => {
        expect(actual).toEqual(expected);
      };
      const scheduler = new TestScheduler(assertion);
      service.http = {get: () => of(42, scheduler)};

      scheduler.maxFrames = Number.POSITIVE_INFINITY; // <== 'maxFrames' - important param!
      const data$ = service.getData(30, scheduler);
      const result = [];

      data$.subscribe(v => result.push(v));

      scheduler.flush();
      expect(result).toEqual([42, 42, 42]);

      // create TestScheduler instance = new TestScheduler(assertion);
      // set scheduler.maxFrames to Infinity
      // call the function service.getData(30, scheduler);
      // subscribe to result observable
      // grab values to array
      // call scheduler.flush()
      // run expect() to check values in array

    });
  });

  describe('getRangeASAP (use TestScheduler as VirtualTimeScheduler, with .delegate trick)', () => {
    it('should emit 4 specific values (with trick)', () => {
      const assertion = (actual, expected) => {
        expect(actual).toEqual(expected);
      };
      const scheduler = new TestScheduler(assertion);
      // AsyncScheduler.delegate = scheduler;
      // (asyncScheduler as any).constructor.delegate = null;

      const range$ = service.getRangeASAP(scheduler);
      const result = [];

      range$.subscribe(v => {
        result.push(v);
        console.log('subscribe:', v, result); // fixme
      });

      console.log('result arr:', result); // fixme
      scheduler.flush();
      // expect(result).toEqual([]); // fixme: wrong expectation
      expect(result).toEqual([0, 1, 2, 3]);
      // AsyncScheduler.delegate = null;
      // (asyncScheduler as any).constructor.delegate = null;

      // create TestScheduler instance = new TestScheduler(assertion);
      // call the function service.getRangeASAP()
      // subscribe to result observable
      // grab values to array
      // call scheduler.flush()
      // run expect() to check values in array
      // do not forget to a assign as (asyncScheduler as any).constructor.delegate = undefined

    });
  });


});
