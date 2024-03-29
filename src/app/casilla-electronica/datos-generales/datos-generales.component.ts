import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CasillaService} from "../../core/services/casilla.service";
import {Condicion, Condicion_Persona_Juridica, Condicion_Persona_Natural,} from "../../core/dto/documento";
import {MatDialog} from "@angular/material/dialog";
import {PersonaNaturalComponent} from "../persona-natural/persona-natural.component";
import {PersonaJuridicaComponent} from "../persona-juridica/persona-juridica.component";
import {firstValueFrom, Subscription} from "rxjs";
import {ValidarCorreoService} from "../../core/services/validar-correo.service";
import { RequestValidateData } from 'src/app/core/dto/personaNaturalDni';
import { PersonaNaturalService } from 'src/app/core/services/persona-natural.service';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { requestGlobal } from 'src/app/core/dto/request';

@Component({
  selector: 'app-datos-generales',
  templateUrl: './datos-generales.component.html',
  styleUrls: ['./datos-generales.component.css']
})
export class DatosGeneralesComponent implements OnInit {


  @ViewChild(PersonaNaturalComponent)  personaNaturalComponent !: PersonaNaturalComponent ;
  @ViewChild(PersonaJuridicaComponent) personaJuridicaComponent!: PersonaJuridicaComponent;
  @Output() completedStep = new EventEmitter<any>();
  @Output() TipoPerson = new EventEmitter<any>();

  formGroup!: FormGroup;
  condicionList: Array<Condicion> = []
  codigoEnviado = false;

  validateRequest : RequestValidateData = new RequestValidateData();


  observableRequestSubscription!: Subscription;
  requestSave: requestGlobal = new requestGlobal();

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private casillaService: CasillaService,
    private validarCorreoService: ValidarCorreoService,
    private cdr: ChangeDetectorRef,
    private personaService : PersonaNaturalService
  ) {

    this.observableRequestSubscription = casillaService.casilla$.subscribe(
      (requestSave: requestGlobal) => {
        this.requestSave = requestSave;
        //if (requestSave) this.companyId = requestSave;
      }
    );
  }

  update() {
    this.cdr.detectChanges();
    var data = this.obtenerCondicion();
    this.requestSave.TipoPersona = data;
    this.TipoPerson.emit(data);

  }
  get personaNaturalFormGroup() {
    return this.personaNaturalComponent?.formGroup || null;
  }

  get personaJuridicaFormGroup() {
    return this.personaJuridicaComponent?.formGroup || null;
  }

  async ngOnInit() {
    this.formGroup = this.formBuilder.group({
      condicion: ['', Validators.required],
    });
    this.personaNaturalFormGroup;
    this.personaJuridicaFormGroup;
    this.condicionList = await firstValueFrom(this.casillaService.getCondicionList())
   

    //SOLO PERSONA NATURAL
    this.formGroup.get('condicion')?.setValue(this.condicionList[0])
    this.update();
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

    if(this.formGroup.valid){

      if(this.esPersonaNatural){
        if(this.personaNaturalFormGroup.valid){

          if(!this.personaNaturalFormGroup.controls['validateEmail'].value){
            this.dialog.open(AlertDialogComponent, {
              disableClose: true,
              hasBackdrop: true,
              data: {cabecera : 'Validación' ,messages: ['No validó el correo electrónico']}
            });
            return;
          }


         // this.validateRequest.tipoDocumento = this.personaNaturalFormGroup.controls['tipoDocumento'].value.codigo;
          this.validateRequest.dni = this.personaNaturalFormGroup.controls['numeroDocumento'].value;
          this.validateRequest.nombreMadre = this.personaNaturalFormGroup.controls['nombreMadre'].value;
          this.validateRequest.nombrePadre = this.personaNaturalFormGroup.controls['nombrePadre'].value;
          this.validateRequest.fechaNacimiento = new Date (this.personaNaturalFormGroup.controls['fechaNacimento'].value);
          this.validateRequest.codigoVerifi = this.personaNaturalFormGroup.controls['digitoVerificacion'].value;
         // this.validateRequest.correo = this.personaNaturalFormGroup.controls['correoElectronico'].value;
          console.log("request envio", this.validateRequest)

          this.personaService.validarDatosPersona(this.validateRequest).subscribe(res =>{
            if(res.status){

             this.generateRequestNaturalEmit();

            }else{
              this.dialog.open(AlertDialogComponent, {
                disableClose: true,
                hasBackdrop: true,
                data: {cabecera : 'Verifique sus datos' ,messages: [res.mensaje]}
              });
              return;
            }
          })
        }else{
          this.personaNaturalComponent?.formGroup.markAllAsTouched()
        }
      }

      if(this.esPersonaJuridica){
        if(this.personaJuridicaFormGroup.valid){

          var tipoDoc = this.personaJuridicaFormGroup.controls['tipoDocumento'].value;
          this.requestSave.tipoDocumento =tipoDoc.nombre;
          this.requestSave.numeroDocumento = this.personaJuridicaFormGroup.controls['numeroDocumento'].value;
          this.requestSave.razonSocial = this.personaJuridicaFormGroup.controls['razonSocial'].value;
          this.requestSave.correoElectronico = this.personaJuridicaFormGroup.controls['correoElectronico'].value;
          this.requestSave.telefono = this.personaJuridicaFormGroup.controls['telefono'].value;
          this.requestSave.domicilioFisico =  this.personaJuridicaFormGroup.controls['direccion'].value;
          this.requestSave.paginaWeb = this.personaJuridicaComponent.formGroup.controls['paginaWeb'].value;
          var departamento  = this.personaJuridicaFormGroup.controls['departamento'].value;
          var provincia  = this.personaJuridicaFormGroup.controls['provincia'].value;
          var distrito  = this.personaJuridicaFormGroup.controls['distrito'].value;

          this.requestSave.departamento = departamento.nodep;
          this.requestSave.provincia = provincia.noprv;
          this.requestSave.distrito = distrito.nodis;
          this.casillaService.setCasilla(this.requestSave);

          this.completedStep.emit();
        }else{
          this.personaJuridicaFormGroup.markAllAsTouched()
        }
      }


    }else{
      this.formGroup.markAllAsTouched();
    }

  }

  validateForms():boolean{

    let retorno = true;


    if(this.formGroup.valid){

      if(this.esPersonaNatural){
        if(this.personaNaturalFormGroup?.valid){
          retorno= false;
        }


      } else{
        if(this.personaJuridicaFormGroup?.valid){
          retorno= false;
        }
      }

      return retorno;
      
    }else{
      return true;
    }


  }



  generateRequestNaturalEmit(){

    var apellidos = this.personaNaturalFormGroup.controls['apellidos'].value.split(' ');
    var tipoDoc = this.personaNaturalFormGroup.controls['tipoDocumento'].value;
    this.requestSave.tipoDocumento = tipoDoc.nombre;
    this.requestSave.numeroDocumento = this.personaNaturalFormGroup.controls['numeroDocumento'].value;
    this.requestSave.nombres = this.personaNaturalFormGroup.controls['nombres'].value;
    this.requestSave.apePaterno = apellidos[0];
    this.requestSave.apeMaterno =  apellidos[1];
    this.requestSave.correoElectronico = this.personaNaturalFormGroup.controls['correoElectronico'].value;
    this.requestSave.numeroCelular = this.personaNaturalFormGroup.controls['numeroCelular'].value;
    this.requestSave.domicilioFisico =  this.personaNaturalFormGroup.controls['domicilioFisico'].value;

    var departamento  = this.personaNaturalFormGroup.controls['departamento'].value;
    var provincia  = this.personaNaturalFormGroup.controls['provincia'].value;
    var distrito  = this.personaNaturalFormGroup.controls['distrito'].value;

    this.requestSave.departamento = departamento.nodep;
    this.requestSave.provincia = provincia.noprv;
    this.requestSave.distrito = distrito.nodis;

    this.casillaService.setCasilla(this.requestSave);
    this.completedStep.emit();
  }

  get esPersonaNatural(): boolean {
    return this.obtenerCondicion() == Condicion_Persona_Natural
  }

  get esPersonaJuridica(): boolean {
    return this.obtenerCondicion() == Condicion_Persona_Juridica
  }
}
