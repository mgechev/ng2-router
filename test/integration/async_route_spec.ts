import {
  describeRouter,
  ddescribeRouter,
  describeWith,
  describeWithout,
  describeWithAndWithout,
  itShouldRoute,
  TEST_ROUTER_PROVIDERS
} from './util';

import {beforeEachProviders, describe} from '@angular/core/testing/testing_internal';

import {registerSpecs} from './impl/async_route_spec_impl';

export function main() {
  describe('async route spec', () => {

    beforeEachProviders(() => TEST_ROUTER_PROVIDERS);

    registerSpecs();

    describeRouter('async routes', () => {
      describeWithout('children', () => {
        describeWith('route data', itShouldRoute);
        describeWithAndWithout('params', itShouldRoute);
      });

      describeWith('sync children',
                   () => { describeWithAndWithout('default routes', itShouldRoute); });

      describeWith('async children', () => {
        describeWithAndWithout('params',
                               () => { describeWithout('default routes', itShouldRoute); });
      });
    });
  });
}
