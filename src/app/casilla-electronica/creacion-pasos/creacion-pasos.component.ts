import {Component, OnInit, ViewChild} from '@angular/core';
import {DatosGeneralesComponent} from "../datos-generales/datos-generales.component";
import {DatosRepresentanteComponent} from "../datos-representante/datos-representante.component";
import {TerminosCondicionesComponent} from "../terminos-condiciones/terminos-condiciones.component";
import {
  SolicitudComponent
} from "../solicitud/solicitud.component";
import {MatStepper} from "@angular/material/stepper";

@Component({
  selector: 'app-creacion-pasos',
  templateUrl: './creacion-pasos.component.html',
  styleUrls: ['./creacion-pasos.component.css']
})
export class CreacionPasosComponent implements OnInit {

  @ViewChild('DatosGeneralesComponent') datosGeneralesComponent!: DatosGeneralesComponent;
  @ViewChild('DatosRepresentanteComponent') datosRepresentanteComponent!: DatosRepresentanteComponent;
  @ViewChild('TerminosCondicionesComponent') terminosCondicionesComponent!: TerminosCondicionesComponent;
  @ViewChild('SolicitudComponent') solicitudCasillaElectronicaComponent!: SolicitudComponent;
  @ViewChild('stepper', {static: false}) stepper: MatStepper | null = null;
  tipoPersona : boolean = false;
  constructor() {
  }

  isEditable = true;

  get datosGeneralesFormGroup() {
    return this.datosGeneralesComponent?.formGroup || null;
  }

  get datosRepresentanteFormGroup() {
    return this.datosRepresentanteComponent?.formGroup || null;
  }

  get terminosCondicionesFormGroup() {
    return this.terminosCondicionesComponent?.formGroup || null;
  }

  get solicitudCasillaElectronicaFormGroup() {
    return this.solicitudCasillaElectronicaComponent?.formGroup || null;
  }

  datosGeneralesCompleted = false
  datosRepresentantesCompleted = false
  terminosyCondicionesCompleted = false
  SolicitudCompleted = false

  completedStep() {
    this.datosGeneralesCompleted = true
    this.stepper?.next()
  }

  completedStepDatos(){
    this.datosRepresentantesCompleted = true;
  }
  completedStepRepresent(){
    this.terminosyCondicionesCompleted = true;
  }

  completedStepTerm(){

  }

  previousStep() {
    this.stepper?.previous()
  }

  ngOnInit(): void {
    this.datosGeneralesFormGroup;

  }


  personType(tipo : any){
    const tip = tipo;
    this.tipoPersona = tip === 'j'? true : false;
  }
}
