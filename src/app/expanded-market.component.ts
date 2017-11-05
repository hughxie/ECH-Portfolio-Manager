import { Component, Input } from '@angular/core';
import { Stock } from './stock';

@Component({
  selector: 'expanded-market',
  templateUrl: './expanded-market.component.html',
  styleUrls: [ './expanded-market.component.css' ]
})

export class ExpandedMarketComponent {
  @Input() stock: Stock;
}
