import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';


@Component({
  selector: 'home',
  templateUrl: './home.html',
  styleUrls: [ './home.css' ],
  providers: [AngularFireDatabase]
})

export class Home {

  symbols : FirebaseListObservable<any[]>;

  constructor(af: AngularFireDatabase) {
    this.symbols = af.list('symbols');
  }

  // onSelect(stock: Stock): void {
  //   this.selectedStock = stock;
  // }
}
