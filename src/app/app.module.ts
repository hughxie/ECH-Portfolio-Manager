import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ExpandedMarketComponent } from './expanded-market.component';
import { UserHomeComponent } from './user-home.component';

@NgModule({
  declarations: [
    AppComponent,
    ExpandedMarketComponent,
    UserHomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
