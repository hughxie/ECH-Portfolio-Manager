import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<h1>{{title}}</h1>
  <user-home></user-home>`,
})

export class AppComponent {
  title = 'Stocks';
}
