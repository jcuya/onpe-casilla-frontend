import { DOCUMENT } from '@angular/common';
import {Component, EventEmitter, HostBinding, Inject, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { Route, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { requestGlobal, RequestRepresentante } from 'src/app/core/dto/request';
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

 
 

  @Output() completedStep = new EventEmitter<any>()
  @Output() previousStep = new EventEmitter<any>()
  formGroup!: FormGroup;
  listFiles : File[] = [];
  imageSrc: string="";

  observableRequestSubscription!: Subscription;
  requestSave: requestGlobal = new requestGlobal();
  requestRepresentante : RequestRepresentante = new RequestRepresentante();

  constructor(
    private formBuilder: FormBuilder,
    private casillaService: CasillaService,
    public dialog: MatDialog,
    private router : Router,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.observableRequestSubscription = casillaService.casilla$.subscribe(
      (requestSave: requestGlobal) => {
        this.requestSave = requestSave;
        this.requestRepresentante = this.requestSave!.representante;
        console.log("data enviar", this.requestSave)
    
        this.onFileChange(this.requestSave.file);
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

    // correoElectronico !: string;
    // numeroCelular!: string;
    // telefono!: string;
    // domicilioFisico!: string;
    // nombres!: string;
    // apePaterno !: string;
    // apeMaterno !: string;
    // tipoDocumento!: string;
    // numeroDocumento!: string;
    // razonSocial!: string;
    // file!: File;

    // TipoPersona !: string;

    const fd = new FormData();
    fd.append('tipoDocumento',this.requestSave.tipoDocumento)
    fd.append('numeroDocumento',this.requestSave.numeroDocumento)
    fd.append('razonSocial',this.requestSave.razonSocial)
    fd.append('correoElectronico',this.requestSave.correoElectronico)
    fd.append('numeroCelular',this.requestSave.numeroCelular)
    fd.append('telefono',this.requestSave.telefono)
    fd.append('paginaweb',this.requestSave.paginaWeb)
    fd.append('domicilioFisico',this.requestSave.domicilioFisico)
    fd.append('nombres',this.requestSave.nombres)
    fd.append('apePaterno',this.requestSave.apePaterno)
    fd.append('apeMaterno',this.requestSave.apeMaterno)
    fd.append('tipoPersona',this.requestSave.TipoPersona)
    fd.append('files',this.requestSave.file)
    let Ubigeo = this.requestSave.departamento + " / " +this.requestSave.provincia + " / " + this.requestSave.distrito

    fd.append('ubigeo',Ubigeo)
    console.log("Toda esta información se enviará a grabar", fd);

    if(this.requestSave.TipoPersona === 'j'){
      fd.append('representante',JSON.stringify(this.requestSave.representante))
      fd.append('filerepresent',this.requestSave.representante.file)
      this.listFiles.push(this.requestSave.representante.file);
    }



    this.casillaService.enviarDatos(fd).subscribe(res =>{


      if(res.status){
        // this.dialog.open(AlertDialogComponent, {
        //   disableClose: true,
        //   hasBackdrop: true,
        //   data: {cabecera : '¡Solicitud Enviada!' ,messages: ['Se ha enviado tu solicitud de registro de casilla.']}
        // }).afterClosed().subscribe(result =>{
        //   this.document.location.href = 'https://casillaelectronica.onpe.gob.pe/#/login';
        // });

        this.completedStep.emit();
        
      }else{
        this.dialog.open(AlertDialogComponent, {
          disableClose: true,
          hasBackdrop: true,
          data: {cabecera : 'Error!' ,messages: ['Error al  registrar']}
        })
      }

    });

  }



  onFileChange(foto : File) {
    const reader = new FileReader();
    
    if(foto) {
      const file = foto;
      reader.readAsDataURL(file);
    
      reader.onload = () => {
   
        this.imageSrc = reader.result as string;
     
        // this.myForm.patchValue({
        //   fileSource: reader.result
        // });
   
      };
   
    }
  }

}
