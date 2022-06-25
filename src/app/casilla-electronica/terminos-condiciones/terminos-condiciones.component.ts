import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Subscription } from 'rxjs';
import { requestGlobal } from 'src/app/core/dto/request';
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

  observableRequestSubscription!: Subscription;
  requestSave: requestGlobal = new requestGlobal();

  constructor(
    private formBuilder: FormBuilder,
    private casillaService: CasillaService
  ) {
    this.terminosCondicionesTexto = casillaService.getTerminosCondiciones()

    this.observableRequestSubscription = casillaService.casilla$.subscribe(
      (requestSave: requestGlobal) => {
        this.requestSave = requestSave;

        
        //if (requestSave) this.companyId = requestSave;
      }
    );
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
    if(this.formGroup.valid){
      if(this.formGroup.controls['terminosCondiciones'].value == true && this.formGroup.controls['politicasDatos'].value == true){
        this.completedStep.emit()
      }else{
        this.formGroup.markAllAsTouched()
        return
      }
    
    
    }else{
      this.formGroup.markAllAsTouched()
      return
    }

    
   
  }
}
