import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CasillaService} from "../../core/services/casilla.service";

@Component({
  selector: 'app-terminos-condiciones',
  templateUrl: './terminos-condiciones.component.html',
  styleUrls: ['./terminos-condiciones.component.css']
})
export class TerminosCondicionesComponent implements OnInit {

  @Output() completedStep = new EventEmitter<any>()
  @Output() previousStep = new EventEmitter<any>()

  formGroup!: FormGroup;
  terminosCondicionesTexto = ''

  constructor(
    private formBuilder: FormBuilder,
    private casillaService: CasillaService
  ) {
    this.terminosCondicionesTexto = casillaService.getTerminosCondiciones()
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      terminosCondiciones: ['', Validators.required],
      politicasDatos: ['', Validators.required]
    });
  }

  regresar() {
    this.previousStep.emit()
  }

  continuar() {
    if(!this.formGroup.valid){
      this.formGroup.markAllAsTouched()
      return
    }
    this.completedStep.emit()
  }
}
