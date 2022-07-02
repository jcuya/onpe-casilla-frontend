import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LayoutComponent} from './layout/layout.component';
import {CasillaElectronicaModule} from "./casilla-electronica/casilla-electronica.module";
import {HttpClientModule} from "@angular/common/http";
import { RouterModule } from '@angular/router';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { ReactiveFormsModule } from '@angular/forms';
import { DatosRepresentanteComponent } from './casilla-electronica/datos-representante/datos-representante.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { RecaptchaFormsModule, RecaptchaModule, RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FileUploadModule,
    CasillaElectronicaModule,
    HttpClientModule,
    MatTooltipModule,
    RouterModule.forRoot([]),
    RecaptchaModule, //this is the recaptcha main module
    RecaptchaFormsModule, //this is the module for form incase form validation
    RecaptchaV3Module
  ],
  providers: [   
    {
    provide: RECAPTCHA_V3_SITE_KEY,
    useValue: environment.KeycodeCaptcha,
  },],
  exports: [],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {
}
