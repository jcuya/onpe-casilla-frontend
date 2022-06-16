import {Component, EventEmitter, HostBinding, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css']
})
export class SolicitudComponent implements OnInit {

  @Output() completedStep = new EventEmitter<any>()
  @Output() previousStep = new EventEmitter<any>()
  formGroup!: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  continuar() {
    this.completedStep.emit(true)
  }

  regresar() {
    this.previousStep.emit()
  }
}
