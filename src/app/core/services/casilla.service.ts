import {Injectable} from '@angular/core';
import {Condicion, TipoDocumento, Cargo} from "../dto/documento";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, map, Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {Departamento, Distrito, Provincia} from "../dto/ubigeo.dto";
import { requestGlobal } from '../dto/request';
import { ResponseValidateData } from '../dto/personaNaturalDni';

const httpOptions = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json'  
  })
};
@Injectable({
  providedIn: 'root'
})
export class CasillaService {

  configUrl = `${environment.serviceUrl}`

  public _casilla: BehaviorSubject<requestGlobal> = new BehaviorSubject<requestGlobal>(new requestGlobal());
  casilla$ = this._casilla.asObservable();
  constructor(
    private http: HttpClient
  ) {

  }

  setCasilla(company: requestGlobal){
    this._casilla.next(company);
  }

  getCasilla(): requestGlobal {
    return this._casilla.value;
  }

  enviarCodigoValidacion(correo: string): Observable<any> {
    return this.http.post(`${this.configUrl}/enviar-codigo-validacion`, {
      correo: correo
    })
  }

  validarCodigoValidacion(correo: string, codigoValidacion: string): Observable<any> {
    return this.http.post(`${this.configUrl}/validar-codigo-validacion`, {
      correo: correo,
      codigoValidacion: codigoValidacion
    })
  }

  enviarDatos(datos: FormData ):Observable<ResponseValidateData>{
    var headers = new HttpHeaders().set("Content-Type","application/json"); 
    return this.http.post<ResponseValidateData>(this.configUrl + '/create-box',datos).pipe(map(resp=>resp));
  }

  getTipoDocumentoAdjuntoList(): Observable<Array<TipoDocumento>> {
    return this.dummy([
      {codigo: 'r', nombre: 'Resolución de designación'},
      {codigo:'o' , nombre : 'Oficio de designación'}
    ])
  }

  getTipoDocumentoList(tipoPersona: String): Observable<Array<TipoDocumento>> {
    return this.dummy(tipoPersona == 'n' ? [
      {codigo: 'DNI', nombre: 'DNI'},
      {codigo: 'CE', nombre: 'CE'},
    ] : [
      {codigo: 'RUC', nombre: 'RUC'},
    ])
  }

  getCondicionList(): Observable<Array<Condicion>> {
    return this.dummy([{codigo: 'n', nombre: 'Persona Natural'},
      {codigo: 'j', nombre: 'Persona Jurídica'},
    ])
  }

  getCargoList(): Observable<Array<Cargo>> {
    return this.dummy([
      {codigo: '1', nombre: 'Tesorero'},
    ])
  }

  getTerminosCondiciones() {
    return `What is Lorem Ipsum?
  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

  Why do we use it?
  It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).

  Where does it come from?
  Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
`
  }

  dummy<T>(value: T) {
    return new Observable<T>(observer => {
      observer.next(value)
      observer.complete()
    })
  }
}
