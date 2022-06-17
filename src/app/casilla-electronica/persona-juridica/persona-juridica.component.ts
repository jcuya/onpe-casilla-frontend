import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
  Condicion_Persona_Juridica,
  Condicion_Persona_Natural,
  TipoDocumento
} from "../../core/dto/documento";
import {CasillaService} from "../../core/services/casilla.service";
import {firstValueFrom} from "rxjs";
import {Departamento, Distrito, Provincia} from "../../core/dto/ubigeo.dto";
import {UbigeoService} from "../../core/services/ubigeo.service";

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
    private ubigeoService: UbigeoService
  ) {
  }

  async ngOnInit() {
    this.formGroup = this.formBuilder.group({
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
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
  }

  obtenerCorreo() {
    return this.formGroup.get('correoElectronico')?.value
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
