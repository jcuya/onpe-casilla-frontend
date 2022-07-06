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
    return `
    <b>Conste por el presente, la aceptación expresa y voluntaria del suscrito respecto a la aceptación de términos y condiciones para el uso de la casilla electrónica de la Oficina Nacional de Procesos Electorales - ONPE, quien manifiesta conocer su contenido, aceptando expresamente la totalidad de las condiciones que a continuación se detallan: </b>` +


    `1.	El Sistema de Notificaciones Electrónicas SISEN-ONPE es un sistema informático, a través del cual la ONPE asigna a su público en general una casilla electrónica en la que se depositan todas las comunicaciones y documentos cursados por los órganos de la ONPE.
      2.	El suscrito acepta haber recibido gratuitamente su código de Usuario y contraseña de acceso a la casilla electrónica los cuales tienen el carácter de confidencial por ser estrictamente personales. Asimismo, por razones de seguridad, el suscrito debe cambiar su contraseña en su primer ingreso y posteriormente  de manera periódica.
      3.	El suscrito  tiene conocimiento que para acceder a su casilla electrónica debe contar con un dispositivo informático conectado a Internet y configurado para navegación por web, a través de los navegadores Mozilla Firefox, Google Chrome y Microsoft Edge, en sus versiones actualizadas.
      4.	El suscrito se compromete a no ceder ni transferir bajo ninguna modalidad ni circunstancia, el uso de la contraseña de su casilla electrónica que la ONPE le asigne; siendo, en todo caso, único responsable del empleo que terceras personas pudieran darle.
      5.	El suscrito acepta que constituye exclusiva responsabilidad de su persona, el omitir (por cualquier circunstancia), revisar periódicamente, abrir su casilla electrónica y tomar conocimiento oportuno de las notificaciones electrónicas remitidas por la ONPE. 
      6.	La casilla electrónica es utilizada exclusivamente para la remisión al suscrito de notificaciones de los pronunciamientos emitidos por la ONPE.
      7.	Soy responsable de conocer y dar cumplimiento a las disposiciones contenidas en el “Reglamento del Sistema de Notificaciones Electrónicas – SISEN-ONPE”, aprobado por Resolución Jefatural n.º 002079-2022-JN/ONPE (25MAY2022).
      8.	Una vez creada y activada la casilla electrónica tiene vigencia indefinida, salvo que se verifique que no tiene actividad por un periodo dos años, al constituir el único medio de notificación desde la ONPE hacia el Usuario respecto a los procedimientos administrativos en curso, conforme con las disposiciones respectivas emitidas en el “Reglamento del Sistema de Notificaciones Electrónicas – SISEN-ONPE”.
      9.	Solamente se asigna una casilla electrónica por persona natural o persona jurídica.
      10.	El suscrito tiene conocimiento y acepta que la no recepción de la Alerta Informativa en su correo electrónico no invalida el acto de notificación realizado en su casilla electrónica.
      11.	El usuario acepta que el cómputo de plazos que se deriven de la notificación a través de la casilla electrónica se inicia a partir del día hábil siguiente de haberse efectuado la notificación. En el sistema informático se consigna la fecha de depósito de la notificación. 
      12.	En cumplimiento con lo dispuesto por la Ley n.º 29733, Ley de Protección de Datos Personales y su Reglamento, aprobado por Decreto Supremo n.º 003-2013-JUS, el Usuario brinda su consentimiento para el tratamiento de sus datos personales, los cuales serán empleados para todos los procedimientos y servicios realizados ante la ONPE.
      13.	En atención a la normativa vigente, la ONPE ha adoptado medidas legales, organizativas y técnicas apropiadas para garantizar la seguridad de los datos personales del suscrito, a fin de evitar su alteración, pérdida, tratamiento indebido o acceso no autorizado. En ese sentido, la ONPE sólo realizará el tratamiento de los datos personales del suscrito que estén almacenados en repositorios que reúnan las condiciones de seguridad exigidas por la normativa de protección de datos personales vigente. 


    
    `
  }

  dummy<T>(value: T) {
    return new Observable<T>(observer => {
      observer.next(value)
      observer.complete()
    })
  }
}
