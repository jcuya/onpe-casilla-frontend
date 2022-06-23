import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CasillaService} from "../../core/services/casilla.service";
import {
  Cargo,
  Condicion_Persona_Natural,
  TipoDocumento,
  TipoDocumento_DNI
} from "../../core/dto/documento";
import {firstValueFrom, Subscription} from "rxjs";
import {ValidarCorreoService} from "../../core/services/validar-correo.service";
import {Departamento, Distrito, Provincia} from "../../core/dto/ubigeo.dto";
import {UbigeoService} from "../../core/services/ubigeo.service";
import { requestGlobal, RequestRepresentante } from 'src/app/core/dto/request';

@Component({
  selector: 'app-datos-representante',
  templateUrl: './datos-representante.component.html',
  styleUrls: ['./datos-representante.component.css']
})
export class DatosRepresentanteComponent implements OnInit {

  @Output() completedStep = new EventEmitter<any>()
  @Output() previousStep = new EventEmitter<any>()

  observableRequestSubscription!: Subscription;
  requestSave: requestGlobal = new requestGlobal();


  requestRepresentante : RequestRepresentante = new RequestRepresentante();
  formGroup!: FormGroup;
  tipoDocumentoAdjuntoList: Array<TipoDocumento> = []
  tipoDocumentoList: Array<TipoDocumento> = []
  departamentoList: Array<Departamento> = []
  provinciaList: Array<Provincia> = []
  distritoList: Array<Distrito> = []
  cargoList: Array<Cargo> = []
  codigoEnviado = false
  maxlength : number = 0;
  constructor(
    private formBuilder: FormBuilder,
    private casillaService: CasillaService,
    private ubigeoService: UbigeoService,
    private validarCorreoService: ValidarCorreoService,
  ) {

    this.observableRequestSubscription = casillaService.casilla$.subscribe(
      (requestSave: requestGlobal) => {
        this.requestSave = requestSave;
        //if (requestSave) this.companyId = requestSave;
      }
    );
  }

  async ngOnInit() {
    this.formGroup = this.formBuilder.group({
      tipoDocumentoAdjunto: ['', Validators.required],
      tipoDocumentoAdjuntoNombre: ['', Validators.required],
     // documentoArchivo: ['', Validators.required],
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
      apellidos: ['', Validators.required],
      nombres: ['', Validators.required],
      correoElectronico: ['',[ Validators.required, Validators.email]],
      numeroCelular: ['', Validators.required],
      departamento: ['', Validators.required],
      provincia: ['', Validators.required],
      distrito: ['', Validators.required],
      domicilioFisico: ['', Validators.required],
      cargo: ['', Validators.required],
      cargoNombre: ['', Validators.required],
      file: ['', Validators.required],
    });
    this.tipoDocumentoAdjuntoList = await firstValueFrom(this.casillaService.getTipoDocumentoAdjuntoList())
    this.tipoDocumentoList = await firstValueFrom(this.casillaService.getTipoDocumentoList(Condicion_Persona_Natural))
    this.departamentoList = await firstValueFrom(this.ubigeoService.getDepartamentoList())
    this.cargoList = await firstValueFrom(this.casillaService.getCargoList())
  }

  handleArchivoAgregado(event: any) {
    console.log(event)
    this.formGroup.get('file')?.setValue(event)
  }

  regresar() {
    this.previousStep.emit()
  }

  siguientePaso() {

    if(this.formGroup.valid){

      var nombreCompleto = this.formGroup.controls['nombres'].value + this.formGroup.controls['apellidos'].value + "";
      var cargo = this.formGroup.controls['cargo'].value ;
      var tipoDocumento = this.formGroup.controls['tipoDocumento'].value ;
      var tipoDocumentoAdjunto = this.formGroup.controls['tipoDocumentoAdjunto'].value;;

      this.requestRepresentante.tipoDocumentoAdjunto = tipoDocumentoAdjunto.nombre;
      this.requestRepresentante.tipoDocumentoAdjuntoNombre = this.formGroup.controls['tipoDocumentoAdjuntoNombre'].value;
      this.requestRepresentante.tipoDocumento = tipoDocumento.nombre;
      this.requestRepresentante.numeroDocumento = this.formGroup.controls['numeroDocumento'].value;
      this.requestRepresentante.nombreCompleto = nombreCompleto;
      this.requestRepresentante.correoElectronico = this.formGroup.controls['correoElectronico'].value;
      this.requestRepresentante.numeroCelular = this.formGroup.controls['numeroCelular'].value;
      this.requestRepresentante.domicilioFisico = this.formGroup.controls['domicilioFisico'].value;
      this.requestRepresentante.cargo = cargo.nombre;
      this.requestRepresentante.cargoNombre = this.formGroup.controls['cargoNombre'].value;
      this.requestRepresentante.file = this.formGroup.controls['file'].value;

      var departamento  = this.formGroup.controls['departamento'].value;
      var provincia  = this.formGroup.controls['provincia'].value;
      var distrito  = this.formGroup.controls['distrito'].value;
      let Ubigeo =  departamento.nodep   + " / " + provincia.noprv + " / " + distrito.nodis;
      this.requestRepresentante.ubigeo = Ubigeo;

      this.requestSave.representante = this.requestRepresentante;
      this.casillaService.setCasilla(this.requestSave);


      this.completedStep.emit()
    }else{
      this.formGroup.markAllAsTouched()
      return;
    }

   
  }

  tipoDocumentoCambiado(value: TipoDocumento) {
   


    if (value.codigo == TipoDocumento_DNI) {
      this.maxlength = 8;
    } else {
      this.maxlength =9
    }
  }

  obtenerCorreo() {
    return this.formGroup.get('correoElectronico')?.value ?? ''
  }

  async continuar() {
    if (await this.validarCorreoService.iniciarValidacion(this.obtenerCorreo(), this.codigoEnviado)) {
      console.log('validación correcta')
      this.siguientePaso()
    } else {
      console.log('no se ha validado')
      this.codigoEnviado = true
    }
  }

  async cambiarProvincia(value: Departamento) {
    this.provinciaList = await firstValueFrom(this.ubigeoService.getProvinciaList(value.ubdep))
    this.distritoList = []
  }

  async cambiarDistrito(value: Provincia) {
    this.distritoList = await firstValueFrom(this.ubigeoService.getDistritoList(value.ubdep, value.ubprv))
  }

  validarsoloNumeros(event : any): boolean{
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
   }
}
