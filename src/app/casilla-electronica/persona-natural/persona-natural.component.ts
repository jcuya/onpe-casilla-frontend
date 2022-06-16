import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Condicion_Persona_Natural, TipoDocumento, TipoDocumento_DNI} from "../../core/dto/documento";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CasillaService} from "../../core/services/casilla.service";
import {MatDialog} from "@angular/material/dialog";
import {firstValueFrom} from "rxjs";
import {Departamento, Distrito, Provincia} from "../../core/dto/ubigeo.dto";
import {UbigeoService} from "../../core/services/ubigeo.service";
import {PersonaNaturalService} from "../../core/services/persona-natural.service";
import {PersonaNaturalDni} from "../../core/dto/personaNaturalDni";
import {ValidacionCorreoComponent} from "../validacion-correo/validacion-correo.component";
import {AlertDialogComponent} from "../alert-dialog/alert-dialog.component";

@Component({
  selector: 'app-persona-natural',
  templateUrl: './persona-natural.component.html',
  styleUrls: ['./persona-natural.component.css']
})
export class PersonaNaturalComponent implements OnInit {
  formGroup!: FormGroup;
  tipoDocumentoList: Array<TipoDocumento> = []
  departamentoList: Array<Departamento> = []
  provinciaList: Array<Provincia> = []
  distritoList: Array<Distrito> = []

  numeroDniValido: Boolean | undefined = undefined
  personaNaturalDni: PersonaNaturalDni | null = null;

  //@Output() FormValidNatural = new EventEmitter<any>()

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private casillaService: CasillaService,
    private ubigeoService: UbigeoService,
    private personaNaturalService: PersonaNaturalService
  ) {
  }

  async ngOnInit() {
    this.formGroup = this.formBuilder.group({
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
      apellidos: ['', Validators.required],
      nombres: ['', Validators.required],
      nombrePadre: ['', Validators.required],
      nombreMadre: ['', Validators.required],
      fechaNacimento: ['', Validators.required],
      digitoVerificacion: ['', Validators.required],
      correoElectronico: ['',[ Validators.required, Validators.email]],
      numeroCelular: ['', Validators.required],
      departamento: ['', Validators.required],
      provincia: ['', Validators.required],
      distrito: ['', Validators.required],
      domicilioFisico: ['', Validators.required],
    })
    this.tipoDocumentoList = await firstValueFrom(this.casillaService.getTipoDocumentoList(Condicion_Persona_Natural))
    this.departamentoList = await firstValueFrom(this.ubigeoService.getDepartamentoList())
  }

  tipoDocumentoCambiado(value: TipoDocumento) {
    this.invalidarDocumento();
    if (value.codigo == TipoDocumento_DNI) {
      this.formGroup.get('nombres')?.disable();
      this.formGroup.get('apellidos')?.disable();
    } else {
      this.formGroup.get('nombres')?.enable();
      this.formGroup.get('apellidos')?.enable();
    }
  }

  validarCorreoElectronico() {

  }

  invalidarDocumento() {
    this.numeroDniValido = false
  }

  async validarDocumento() {
    console.log('validando documento')
    const numeroDocumento = (this.formGroup.get('numeroDocumento')?.value ?? '') as string
    if (this.esTipoDocumentoDni && numeroDocumento.length == 8) {
      this.personaNaturalDni = await firstValueFrom(this.personaNaturalService.obtenerDatosPersona(numeroDocumento))
      if (this.personaNaturalDni == null) {
        this.dialog.open(AlertDialogComponent, {
          disableClose: true,
          hasBackdrop: true,
          data: {messages: ['No se encontró la información de la persona']}
        });
        return;
      }
      console.log(this.personaNaturalDni);
      this.formGroup.patchValue({
        'nombres': this.personaNaturalDni.nombres,
        'apellidos': this.personaNaturalDni.apellidos,
      });
    }
  }

  cargarPersona() {
    const tipoDocumento = this.formGroup.get('tipoDocumento')?.value ?? ''
    const numeroDocumento = this.formGroup.get('numeroDocumento')?.value ?? ''
    console.log('cargando dni para', tipoDocumento, numeroDocumento)
  }

  obtenerCorreo() {
    return this.formGroup.get('correoElectronico')?.value ?? ''
  }

  get esTipoDocumentoDni() {
    return this.formGroup?.get('tipoDocumento')?.value.codigo == TipoDocumento_DNI
  }

  async cambiarProvincia(value: Departamento) {
    this.provinciaList = await firstValueFrom(this.ubigeoService.getProvinciaList(value.ubdep))
    this.distritoList = []
  }

  async cambiarDistrito(value: Provincia) {
    this.distritoList = await firstValueFrom(this.ubigeoService.getDistritoList(value.ubdep, value.ubprv))
  }
}
