import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {PersonaNaturalDni} from "../dto/personaNaturalDni";

@Injectable({
  providedIn: 'root'
})
export class PersonaNaturalService {

  configUrl = `${environment.serviceUrl}`

  constructor(
    private http: HttpClient
  ) { }

  obtenerDatosPersona(dni: string): Observable<PersonaNaturalDni> {
    return this.http.post<PersonaNaturalDni>(`${this.configUrl}/obtener-datos-persona-dni`, {
      dni: dni
    })
  }
}
