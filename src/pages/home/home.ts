import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase} from 'angularfire2/database';
//import { FirebaseListObservable } from 'angularfire2';

//igi
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [AngularFireDatabase]
})

export class HomePage {

  symbols : FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, af: AngularFireDatabase) {

    this.symbols = af.list('/symbols');

  }

}
