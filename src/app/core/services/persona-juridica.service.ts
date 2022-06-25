import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { map, Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import { responseSunat } from '../dto/personaJuridica';

@Injectable({
  providedIn: 'root'
})
export class PersonaJuridicaService {

  configUrl = `${environment.serviceUrl}`

  constructor(
    private http: HttpClient
  ) { }

  obtenerDatosPersonaJuridica(ruc: string): Observable<responseSunat> {
    return this.http.post<responseSunat>(`${this.configUrl}/validarRUC`, {
      ruc: ruc
    })
  }



}
