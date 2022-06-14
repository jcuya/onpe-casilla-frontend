import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CasillaService} from "../../core/services/casilla.service";
import {Condicion, Condicion_Persona_Juridica, Condicion_Persona_Natural,} from "../../core/dto/documento";
import {MatDialog} from "@angular/material/dialog";
import {PersonaNaturalComponent} from "../persona-natural/persona-natural.component";
import {PersonaJuridicaComponent} from "../persona-juridica/persona-juridica.component";
import {firstValueFrom} from "rxjs";
import {ValidarCorreoService} from "../../core/services/validar-correo.service";

@Component({
  selector: 'app-datos-generales',
  templateUrl: './datos-generales.component.html',
  styleUrls: ['./datos-generales.component.css']
})
export class DatosGeneralesComponent implements OnInit {

  @ViewChild(PersonaNaturalComponent) personaNaturalComponent!: PersonaNaturalComponent;
  @ViewChild(PersonaJuridicaComponent) personaJuridicaComponent!: PersonaJuridicaComponent;
  @Output() completedStep = new EventEmitter<any>()

  formGroup!: FormGroup;
  condicionList: Array<Condicion> = []
  codigoEnviado = false

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private casillaService: CasillaService,
    private validarCorreoService: ValidarCorreoService,
    private cdr: ChangeDetectorRef
  ) {
  }

  update() {
    this.cdr.detectChanges()
  }

  async ngOnInit() {
    this.formGroup = this.formBuilder.group({
      condicion: ['', Validators.required],
    });
    this.condicionList = await firstValueFrom(this.casillaService.getCondicionList())
  }

  obtenerCondicion() {
    //return Condicion_Persona_Natural
    //todo enable
    return this.formGroup.get('condicion')?.value.codigo
  }

  async continuar() {
    console.log('siguiente paso')
    this.siguientePaso();
    /*if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched()
      return
    }
    let correo: string | null = null
    if (this.esPersonaNatural) {
      if (!this.personaNaturalComponent?.formGroup.valid) {
        this.personaNaturalComponent?.formGroup.markAllAsTouched()
        return
      }
      correo = this.personaNaturalComponent.obtenerCorreo()
    } else if (this.esPersonaJuridica) {
      if (!this.personaJuridicaComponent?.formGroup.valid) {
        this.personaJuridicaComponent?.formGroup.markAllAsTouched()
        return
      }
      correo = this.personaJuridicaComponent.obtenerCorreo()
    }
    if (correo == null) {
      return
    }
    if (await this.validarCorreoService.iniciarValidacion(correo, this.codigoEnviado)) {
      this.siguientePaso()
    } else {
      this.codigoEnviado = true
    }*/
  }

  siguientePaso() {
    this.completedStep.emit()
  }

  get esPersonaNatural(): boolean {
    return this.obtenerCondicion() == Condicion_Persona_Natural
  }

  get esPersonaJuridica(): boolean {
    return this.obtenerCondicion() == Condicion_Persona_Juridica
  }
}
