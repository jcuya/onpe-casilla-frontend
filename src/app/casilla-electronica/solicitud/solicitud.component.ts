import {Component, EventEmitter, HostBinding, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { requestGlobal } from 'src/app/core/dto/request';
import { CasillaService } from 'src/app/core/services/casilla.service';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { DatosGeneralesComponent } from '../datos-generales/datos-generales.component';
import { DatosRepresentanteComponent } from '../datos-representante/datos-representante.component';
import { PersonaJuridicaComponent } from '../persona-juridica/persona-juridica.component';
import { PersonaNaturalComponent } from '../persona-natural/persona-natural.component';
import { TerminosCondicionesComponent } from '../terminos-condiciones/terminos-condiciones.component';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css']
})
export class SolicitudComponent implements OnInit {

 
  requestEnvio : requestGlobal = new requestGlobal(); 

  @Output() completedStep = new EventEmitter<any>()
  @Output() previousStep = new EventEmitter<any>()
  formGroup!: FormGroup;

  observableRequestSubscription!: Subscription;
  requestSave: requestGlobal = new requestGlobal();

  constructor(
    private formBuilder: FormBuilder,
    private casillaService: CasillaService,
    public dialog: MatDialog,
  ) {
    this.observableRequestSubscription = casillaService.casilla$.subscribe(
      (requestSave: requestGlobal) => {
        this.requestSave = requestSave;
        //if (requestSave) this.companyId = requestSave;
      }
    );
  }



  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  continuar() {
    this.enviar();
    //this.completedStep.emit(true)
  }

  regresar() {
    this.previousStep.emit()
  }





  enviar(){

    this.casillaService.enviarDatos(this.requestSave).subscribe(res =>{

console.log("respuesta" , res)

      // if(res.status){
      //   this.dialog.open(AlertDialogComponent, {
      //     disableClose: true,
      //     hasBackdrop: true,
      //     data: {messages: 'Usuario registrado correctamente'}
      //   });
      //   return;
      // }

    });






  }


}
