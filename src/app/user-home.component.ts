import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { NgClass } from '@angular/common';



@Component({
  selector: 'user-home',
  templateUrl: './user-home.component.html',
  styleUrls: [ './user-home.component.css' ],
  providers: [AngularFireDatabase]
})

export class UserHomeComponent {
  symbols : FirebaseListObservable<any[]>;
  cryptos : FirebaseListObservable<any[]>;


  overviewSymbol : String = null;
  overviewName : String = null;
  overviewPrice : number = null;
  overviewChange : number = null;
  overviewVolume : number = null;
  constructor(af: AngularFireDatabase) {
    this.symbols = af.list('symbols');
    this.cryptos = af.list('crypto');
  }

  selectStock(symbol) {
    console.log(symbol);

    this.overviewSymbol = symbol.$key;
    this.overviewName = symbol.name;
    this.overviewPrice = symbol.price;
    this.overviewChange = symbol.change;
    this.overviewVolume = symbol.volume;
  }

}
