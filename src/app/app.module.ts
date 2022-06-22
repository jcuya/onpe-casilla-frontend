import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LayoutComponent} from './layout/layout.component';
import {CasillaElectronicaModule} from "./casilla-electronica/casilla-electronica.module";
import {HttpClientModule} from "@angular/common/http";
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CasillaElectronicaModule,
    HttpClientModule,
    RouterModule.forRoot([])
  ],
  providers: [],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
