import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
  Condicion_Persona_Juridica,
  Condicion_Persona_Natural,
  TipoDocumento,
  TipoDocumento_RUC
} from "../../core/dto/documento";
import {CasillaService} from "../../core/services/casilla.service";
import {firstValueFrom} from "rxjs";
import {Departamento, Distrito, Provincia} from "../../core/dto/ubigeo.dto";
import {UbigeoService} from "../../core/services/ubigeo.service";
import { PersonaJuridicaService } from 'src/app/core/services/persona-juridica.service';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-persona-juridica',
  templateUrl: './persona-juridica.component.html',
  styleUrls: ['./persona-juridica.component.css']
})
export class PersonaJuridicaComponent implements OnInit {

  formGroup!: FormGroup;
  tipoDocumentoList: Array<TipoDocumento> = []
  departamentoList: Array<Departamento> = []
  provinciaList: Array<Provincia> = []
  distritoList: Array<Distrito> = []

  constructor(
    private formBuilder: FormBuilder,
    private casillaService: CasillaService,
    private ubigeoService: UbigeoService,
    private personaJuridicaService :PersonaJuridicaService,
    private dialog: MatDialog
  ) {
  }

  async ngOnInit() {
    this.formGroup = this.formBuilder.group({
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
     // razonSocial: [{value: '', disabled: true}, Validators.required],
      razonSocial: ['', Validators.required],
      correoElectronico: ['',[ Validators.required, Validators.email]],
      ciudadTelefono: ['', Validators.required],
      telefono: ['', Validators.required],
      departamento: ['', Validators.required],
      provincia: ['', Validators.required],
      distrito: ['', Validators.required],
      direccion: ['', Validators.required],
      paginaWeb: ['', Validators.required],
    })
    this.tipoDocumentoList = await firstValueFrom(this.casillaService.getTipoDocumentoList(Condicion_Persona_Juridica))
    this.departamentoList = await firstValueFrom(this.ubigeoService.getDepartamentoList())
   // this.formGroup.get('razonSocial')?.disable();
  }

  obtenerCorreo() {
    return this.formGroup.get('correoElectronico')?.value
  }

  get esTipoDocumentoRuc() {
    return this.formGroup?.get('tipoDocumento')?.value.codigo == TipoDocumento_RUC
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


   async validarDocumento() {
    console.log('validando documento')
    const numeroDocumento = (this.formGroup.get('numeroDocumento')?.value ?? '') as string
    if (this.esTipoDocumentoRuc && numeroDocumento.length == 11) {
     var res = await firstValueFrom(this.personaJuridicaService.obtenerDatosPersonaJuridica(numeroDocumento))
      if (res == null) {
        this.dialog.open(AlertDialogComponent, {
          disableClose: true,
          hasBackdrop: true,
          data: {cabecera : 'Notificación' ,messages: ['No se encontró la información de la persona jurídica']}
        });
        return;
      }
      this.formGroup.patchValue({
        'razonSocial': res.razonSocial,
      });
    }
  }
}
