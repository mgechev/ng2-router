import {
  beforeEach,
  ddescribe,
  xdescribe,
  describe,
  expect,
  iit,
  inject,
  beforeEachProviders,
  it,
  xit
} from '@angular/core/testing/testing_internal';
import {TestComponentBuilder, ComponentFixture} from '@angular/compiler/testing';
import {AsyncTestCompleter} from '@angular/core/testing/testing_internal';

import {Location} from '@angular/common';
import {Component} from '@angular/core';
import {Router, ROUTER_DIRECTIVES, Route, AuxRoute, RouteConfig} from '@angular/router-deprecated';
import {specs, compile, clickOnElement, getHref} from '../util';
import {BaseException} from '../../../src/facade/exceptions';
import {By} from '@angular/platform-browser/src/dom/debug/by';

function getLinkElement(rtc: ComponentFixture<any>, linkIndex: number = 0) {
  return rtc.debugElement.queryAll(By.css('a'))[linkIndex].nativeElement;
}

function auxRoutes() {
  var tcb: TestComponentBuilder;
  var fixture: ComponentFixture<any>;
  var rtr;

  beforeEach(inject([TestComponentBuilder, Router], (tcBuilder, router) => {
    tcb = tcBuilder;
    rtr = router;
  }));

  it('should recognize and navigate from the URL', inject([AsyncTestCompleter], (async) => {
       compile(tcb, `main {<router-outlet></router-outlet>} | aux {<router-outlet name="modal"></router-outlet>}`)
           .then((rtc) => {fixture = rtc})
           .then((_) => rtr.config([
             new Route({path: '/hello', component: HelloCmp, name: 'Hello'}),
             new AuxRoute({path: '/modal', component: ModalCmp, name: 'Aux'})
           ]))
           .then((_) => rtr.navigateByUrl('/(modal)'))
           .then((_) => {
             fixture.detectChanges();
             expect(fixture.debugElement.nativeElement).toHaveText('main {} | aux {modal}');
             async.done();
           });
     }));

  it('should navigate via the link DSL', inject([AsyncTestCompleter], (async) => {
       compile(tcb, `main {<router-outlet></router-outlet>} | aux {<router-outlet name="modal"></router-outlet>}`)
           .then((rtc) => {fixture = rtc})
           .then((_) => rtr.config([
             new Route({path: '/hello', component: HelloCmp, name: 'Hello'}),
             new AuxRoute({path: '/modal', component: ModalCmp, name: 'Modal'})
           ]))
           .then((_) => rtr.navigate(['/', ['Modal']]))
           .then((_) => {
             fixture.detectChanges();
             expect(fixture.debugElement.nativeElement).toHaveText('main {} | aux {modal}');
             async.done();
           });
     }));

  it('should generate a link URL', inject([AsyncTestCompleter], (async) => {
       compile(
           tcb,
           `<a [routerLink]="['/', ['Modal']]">open modal</a> | main {<router-outlet></router-outlet>} | aux {<router-outlet name="modal"></router-outlet>}`)
           .then((rtc) => {fixture = rtc})
           .then((_) => rtr.config([
             new Route({path: '/hello', component: HelloCmp, name: 'Hello'}),
             new AuxRoute({path: '/modal', component: ModalCmp, name: 'Modal'})
           ]))
           .then((_) => {
             fixture.detectChanges();
             expect(getHref(getLinkElement(fixture))).toEqual('/(modal)');
             async.done();
           });
     }));

  it('should navigate from a link click',
     inject([AsyncTestCompleter, Location], (async, location) => {
       compile(
           tcb,
           `<a [routerLink]="['/', ['Modal']]">open modal</a> | <a [routerLink]="['/Hello']">hello</a> | main {<router-outlet></router-outlet>} | aux {<router-outlet name="modal"></router-outlet>}`)
           .then((rtc) => {fixture = rtc})
           .then((_) => rtr.config([
             new Route({path: '/hello', component: HelloCmp, name: 'Hello'}),
             new AuxRoute({path: '/modal', component: ModalCmp, name: 'Modal'})
           ]))
           .then((_) => {
             fixture.detectChanges();
             expect(fixture.debugElement.nativeElement)
                 .toHaveText('open modal | hello | main {} | aux {}');

             var navCount = 0;

             rtr.subscribe((_) => {
               navCount += 1;
               fixture.detectChanges();
               if (navCount == 1) {
                 expect(fixture.debugElement.nativeElement)
                     .toHaveText('open modal | hello | main {} | aux {modal}');
                 expect(location.urlChanges).toEqual(['/(modal)']);
                 expect(getHref(getLinkElement(fixture, 0))).toEqual('/(modal)');
                 expect(getHref(getLinkElement(fixture, 1))).toEqual('/hello(modal)');

                 // click on primary route link
                 clickOnElement(getLinkElement(fixture, 1));
               } else if (navCount == 2) {
                 expect(fixture.debugElement.nativeElement)
                     .toHaveText('open modal | hello | main {hello} | aux {modal}');
                 expect(location.urlChanges).toEqual(['/(modal)', '/hello(modal)']);
                 expect(getHref(getLinkElement(fixture, 0))).toEqual('/hello(modal)');
                 expect(getHref(getLinkElement(fixture, 1))).toEqual('/hello(modal)');
                 async.done();
               } else {
                 throw new BaseException(`Unexpected route change #${navCount}`);
               }
             });

             clickOnElement(getLinkElement(fixture));
           });
     }));
}


function auxRoutesWithAPrimaryRoute() {
  var tcb: TestComponentBuilder;
  var fixture: ComponentFixture<any>;
  var rtr;

  beforeEach(inject([TestComponentBuilder, Router], (tcBuilder, router) => {
    tcb = tcBuilder;
    rtr = router;
  }));

  it('should recognize and navigate from the URL', inject([AsyncTestCompleter], (async) => {
       compile(tcb, `main {<router-outlet></router-outlet>} | aux {<router-outlet name="modal"></router-outlet>}`)
           .then((rtc) => {fixture = rtc})
           .then((_) => rtr.config([
             new Route({path: '/hello', component: HelloCmp, name: 'Hello'}),
             new AuxRoute({path: '/modal', component: ModalCmp, name: 'Aux'})
           ]))
           .then((_) => rtr.navigateByUrl('/hello(modal)'))
           .then((_) => {
             fixture.detectChanges();
             expect(fixture.debugElement.nativeElement).toHaveText('main {hello} | aux {modal}');
             async.done();
           });
     }));

  it('should navigate via the link DSL', inject([AsyncTestCompleter], (async) => {
       compile(tcb, `main {<router-outlet></router-outlet>} | aux {<router-outlet name="modal"></router-outlet>}`)
           .then((rtc) => {fixture = rtc})
           .then((_) => rtr.config([
             new Route({path: '/hello', component: HelloCmp, name: 'Hello'}),
             new AuxRoute({path: '/modal', component: ModalCmp, name: 'Modal'})
           ]))
           .then((_) => rtr.navigate(['/Hello', ['Modal']]))
           .then((_) => {
             fixture.detectChanges();
             expect(fixture.debugElement.nativeElement).toHaveText('main {hello} | aux {modal}');
             async.done();
           });
     }));

  it('should generate a link URL', inject([AsyncTestCompleter], (async) => {
       compile(
           tcb,
           `<a [routerLink]="['/Hello', ['Modal']]">open modal</a> | main {<router-outlet></router-outlet>} | aux {<router-outlet name="modal"></router-outlet>}`)
           .then((rtc) => {fixture = rtc})
           .then((_) => rtr.config([
             new Route({path: '/hello', component: HelloCmp, name: 'Hello'}),
             new AuxRoute({path: '/modal', component: ModalCmp, name: 'Modal'})
           ]))
           .then((_) => {
             fixture.detectChanges();
             expect(getHref(getLinkElement(fixture))).toEqual('/hello(modal)');
             async.done();
           });
     }));

  it('should navigate from a link click',
     inject([AsyncTestCompleter, Location], (async, location) => {
       compile(
           tcb,
           `<a [routerLink]="['/Hello', ['Modal']]">open modal</a> | main {<router-outlet></router-outlet>} | aux {<router-outlet name="modal"></router-outlet>}`)
           .then((rtc) => {fixture = rtc})
           .then((_) => rtr.config([
             new Route({path: '/hello', component: HelloCmp, name: 'Hello'}),
             new AuxRoute({path: '/modal', component: ModalCmp, name: 'Modal'})
           ]))
           .then((_) => {
             fixture.detectChanges();
             expect(fixture.debugElement.nativeElement).toHaveText('open modal | main {} | aux {}');

             rtr.subscribe((_) => {
               fixture.detectChanges();
               expect(fixture.debugElement.nativeElement)
                   .toHaveText('open modal | main {hello} | aux {modal}');
               expect(location.urlChanges).toEqual(['/hello(modal)']);
               async.done();
             });

             clickOnElement(getLinkElement(fixture));
           });
     }));
}

export function registerSpecs() {
  specs['auxRoutes'] = auxRoutes;
  specs['auxRoutesWithAPrimaryRoute'] = auxRoutesWithAPrimaryRoute;
}


@Component({selector: 'hello-cmp', template: `{{greeting}}`})
class HelloCmp {
  greeting: string;
  constructor() { this.greeting = 'hello'; }
}

@Component({selector: 'modal-cmp', template: `modal`})
class ModalCmp {
}

@Component({
  selector: 'aux-cmp',
  template: 'main {<router-outlet></router-outlet>} | ' +
                'aux {<router-outlet name="modal"></router-outlet>}',
  directives: [ROUTER_DIRECTIVES],
})
@RouteConfig([
  new Route({path: '/hello', component: HelloCmp, name: 'Hello'}),
  new AuxRoute({path: '/modal', component: ModalCmp, name: 'Aux'})
])
class AuxCmp {
}
