import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CasillaService} from "../../core/services/casilla.service";
import {
  Cargo,
  Condicion_Persona_Natural,
  TipoDocumento,
  TipoDocumento_DNI
} from "../../core/dto/documento";
import {firstValueFrom} from "rxjs";
import {ValidarCorreoService} from "../../core/services/validar-correo.service";
import {Departamento, Distrito, Provincia} from "../../core/dto/ubigeo.dto";
import {UbigeoService} from "../../core/services/ubigeo.service";

@Component({
  selector: 'app-datos-representante',
  templateUrl: './datos-representante.component.html',
  styleUrls: ['./datos-representante.component.css']
})
export class DatosRepresentanteComponent implements OnInit {

  @Output() completedStep = new EventEmitter<any>()
  @Output() previousStep = new EventEmitter<any>()

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
