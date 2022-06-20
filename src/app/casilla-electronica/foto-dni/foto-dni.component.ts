import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-foto-dni',
  templateUrl: './foto-dni.component.html',
  styleUrls: ['./foto-dni.component.css']
})
export class FotoDniComponent implements OnInit {

  @Output() completedStep = new EventEmitter<any>()
  @Output() previousStep = new EventEmitter<any>()

  formGroup!: FormGroup;
  constructor( private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
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
