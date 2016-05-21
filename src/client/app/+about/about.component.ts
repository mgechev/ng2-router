import { Component, Inject } from '@angular/core';
import { DEFER } from '@angular/router-deprecated';

/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-about',
  templateUrl: 'about.component.html',
  styleUrls: ['about.component.css']
})
export class AboutComponent {
  constructor(@Inject(DEFER) name: any) {
    console.log(name);
  }
}
