import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES, RouteParams, RouteConfig } from '@angular/router-deprecated';
import { HTTP_PROVIDERS} from '@angular/http';

import { AboutComponent } from './+about/index';
import { HomeComponent } from './+home/index';
import { NameListService, NavbarComponent, ToolbarComponent } from './shared/index';

/**
 * This class represents the main application component. Within the @Routes annotation is the configuration of the
 * applications routes, configuring the paths for the lazy loaded components (HomeComponent, AboutComponent).
 */
@Component({
  moduleId: module.id,
  selector: 'sd-app',
  viewProviders: [NameListService, HTTP_PROVIDERS],
  templateUrl: 'app.component.html',
  directives: [ROUTER_DIRECTIVES, NavbarComponent, ToolbarComponent]
})
@RouteConfig([
  {
    path: '/',
    name: 'Home',
    component: HomeComponent
  },
  {
    path: '/about/:name',
    name: 'About',
    component: AboutComponent,
    defer: {
      name: {
        resolve: (params: RouteParams) => {
          return new Promise((resolve, reject) => {
            setTimeout(() => resolve(params.get('name')), 2000);
          });
        },
        deps: [RouteParams]
      }
    }
  }
])
export class AppComponent {}
