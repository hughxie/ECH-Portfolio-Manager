import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';




import { Stock } from './stock';

const STOCKS: Stock[] = [
  {id: 1, fullName: 'Google', symbol: 'GOOG', currentPrice: 625.67, netPercent: 2.34, netChange: 7.95},
  {id: 2, fullName: 'Apple', symbol: 'AAPL', currentPrice: 123, netPercent: 1.33, netChange: 6.51},
  {id: 3, fullName: 'Shopify', symbol: 'SHOP', currentPrice: 93.32, netPercent: 4.6, netChange: 9.3},
  {id: 4, fullName: 'Royal Bank of Canada', symbol: 'RBC', currentPrice: 94, netPercent: 1.71, netChange: 0.98},
  {id: 5, fullName: 'Bank of Montreal', symbol: 'BMO', currentPrice: 52, netPercent: 3.64, netChange: 8.42}
];

@Component({
  selector: 'user-home',
  templateUrl: './user-home.component.html',
  styleUrls: [ './user-home.component.css' ],
  providers: [AngularFireDatabase]
})

export class UserHomeComponent {
  stocks = STOCKS;
  selectedStock: Stock;
  symbols : FirebaseListObservable<any[]>;

  constructor(af: AngularFireDatabase) {
    this.symbols = af.list('crypto');
  }

  onSelect(stock: Stock): void {
    this.selectedStock = stock;
  }
}
