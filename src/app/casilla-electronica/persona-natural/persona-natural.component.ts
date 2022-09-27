import {Component, EventEmitter, Inject, OnInit, Output, Renderer2} from '@angular/core';
import {AbstractControl, FormControl} from '@angular/forms';
import {Condicion_Persona_Natural, TipoDocumento, TipoDocumento_DNI, TipoDocumento_CE} from "../../core/dto/documento";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CasillaService} from "../../core/services/casilla.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {firstValueFrom, Subscription} from "rxjs";
import {Departamento, Distrito, Provincia} from "../../core/dto/ubigeo.dto";
import {UbigeoService} from "../../core/services/ubigeo.service";
import {PersonaNaturalService} from "../../core/services/persona-natural.service";
import {ObtenerDatosPersonaDniDto, PersonaNaturalDni} from "../../core/dto/personaNaturalDni";
import {ValidacionCorreoComponent} from "../validacion-correo/validacion-correo.component";
import {AlertDialogComponent} from "../alert-dialog/alert-dialog.component";
import { SharedDialogComponent } from '../shared/shared-dialog/shared-dialog.component';
import { ValidarCorreoService } from 'src/app/core/services/validar-correo.service';
import {TooltipPosition} from '@angular/material/tooltip';
import {MatTooltipModule} from '@angular/material/tooltip';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import {
  RECAPTCHA_V3_SITE_KEY,
  RecaptchaV3Module,
  ReCaptchaV3Service,
} from 'ng-recaptcha';
import { environment } from 'src/environments/environment';
import { NgbCalendar, NgbInputDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
//import 'moment/locale/ja';

@Component({
  selector: 'app-persona-natural',
  templateUrl: './persona-natural.component.html',
  styleUrls: ['./persona-natural.component.css']
})
export class PersonaNaturalComponent implements OnInit {
  formGroup!: FormGroup;
  tipoDocumentoList: Array<TipoDocumento> = []
  departamentoList: Array<Departamento> = []
  provinciaList: Array<Provincia> = []
  distritoList: Array<Distrito> = []
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  position = new FormControl(this.positionOptions[0]);

  numeroDniValido: Boolean | undefined = undefined;
 
  public buscando: boolean = false;
  personaNaturalDni: PersonaNaturalDni | null = null;
  // valueIniCelular: String = '9';
  recaptchaGlobal: String = '';

  //@Output() FormValidNatural = new EventEmitter<any>()
   maxlength : number = 8;
   minlength : number = 8;

   sitekey = '';
   RequerdCaptcha: boolean = true;
   captchaView!: boolean;
   TOkenCaptcha: string = '';

   public loading: boolean = false;
   blockInput : boolean = true;
   todaydate : Date = new Date( new Date().setFullYear(new Date().getFullYear() - 18));
   maxdate  !: any;

   activar  : boolean = true;
   cont = 0;
   esIos: boolean = false;
   

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private casillaService: CasillaService,
    private correoService : ValidarCorreoService,
    private ubigeoService: UbigeoService,
    private personaNaturalService: PersonaNaturalService,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private reCaptchaV3Service: ReCaptchaV3Service,
    config: NgbInputDatepickerConfig, calendar: NgbCalendar,
    private renderer: Renderer2
  ) {
    this._locale = 'es';
    this._adapter.setLocale(this._locale);
    this.sitekey =  environment.KeycodeCaptcha;
    this.maxdate = {year: this.todaydate.getFullYear(), month: this.todaydate.getMonth(), day: this.todaydate.getDay()};
  }

  async ngOnInit() {
    this.createForm();
    this.formGroup.get('numeroDocumento')?.disable();
    this.desactivarInputsInit();
    this.tipoDocumentoList = await firstValueFrom(this.casillaService.getTipoDocumentoList(Condicion_Persona_Natural));
    this.departamentoList = await firstValueFrom(this.ubigeoService.getDepartamentoList()); 
    this.dipositivo();
    console.log(this.esIos);
  }

  createForm(value ="-"){
    this.formGroup = this.formBuilder.group({
      tipoDocumento: [value, Validators.required],
      numeroDocumento: ['', [Validators.required,Validators.pattern('^[0-9]*$')]],
      //apellidos: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: [''],
      nombres: ['', Validators.required],
      //nombrePadre: ['', Validators.required],
      //nombreMadre: ['', Validators.required],
      fechaNacimento: ['', Validators.required],
      digitoVerificacion: ['',  Validators.required ],
      correoElectronico: ['',[ Validators.required, Validators.email]],
      numeroCelular: ['', Validators.required],
      departamento: ['-', Validators.required],
      provincia: ['-', Validators.required],
      distrito: ['-', Validators.required],
      domicilioFisico: ['', Validators.required],
      validateEmail : [false, Validators.required],      
      recaptchaReactive: ['']
    })
  }

  dipositivo(){
    var ua = navigator.userAgent;
    if(/iPhone|iPad|iPod|CriOS/i.test(ua)){ //Todos los dispositivos móviles---->: if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua))
      this.esIos = true;
      this.formGroup.get("tipoDocumento")?.setValue('-');
    }
    /*else if(/Chrome/i.test(ua)){
       console.log('Chrome');
    }
    else{
      console.log('Desktop');
    }*/
  }

  desactivarInputsInit(){
    this.formGroup.get('numeroDocumento')?.disable();
    this.formGroup.get('apellidoPaterno')?.disable();
    this.formGroup.get('apellidoMaterno')?.disable();
    this.formGroup.get('nombres')?.disable();
    this.formGroup.get('fechaNacimento')?.disable();
    this.formGroup.get('digitoVerificacion')?.disable();
    this.formGroup.get('correoElectronico')?.disable();
    this.formGroup.get('numeroCelular')?.disable();
    this.formGroup.get('departamento')?.disable();
    this.formGroup.get('provincia')?.disable();
    this.formGroup.get('distrito')?.disable();
    this.formGroup.get('domicilioFisico')?.disable();

    // if(this.esIos = true){
    //   this.formGroup.get('numeroDocumento')?.enable();
    // }
  }

  activarInputs(){
    this.formGroup.get('apellidoPaterno')?.enable();
    this.formGroup.get('apellidoMaterno')?.enable();
    this.formGroup.get('nombres')?.enable();
    this.formGroup.get('fechaNacimento')?.enable();
    this.formGroup.get('digitoVerificacion')?.enable();
    this.formGroup.get('correoElectronico')?.enable();
    this.formGroup.get('numeroCelular')?.enable();
    this.formGroup.get('departamento')?.enable();
    this.formGroup.get('provincia')?.enable();
    this.formGroup.get('distrito')?.enable();
    this.formGroup.get('domicilioFisico')?.enable();
  }

  tipoDocumentoCambiado() {

    if(this.cont == 0){
      this.activarInputs();
      //this.formGroup.get('numeroDocumento')?.enable();
    }


 


    const value  = this.formGroup.get('tipoDocumento')?.value;
    this.blockInput = false;
      this.provinciaList = []
      this.distritoList = []
    
    this.invalidarDocumento();

    
    if (value === TipoDocumento_DNI) {
      this.maxlength = 8;
      this.minlength = 8;
      this.formGroup.get('nombres')?.disable();
      this.formGroup.get('apellidoPaterno')?.disable();
      this.formGroup.get('apellidoMaterno')?.disable();
      this.formGroup.get('numeroDocumento')?.enable();      
      this.formGroup.get('correoElectronico')?.enable();
      if(this.esIos = true){
        this.formGroup.get('numeroDocumento')?.enable();
      }
    } if(value === TipoDocumento_CE) {
      this.maxlength = 9
      this.minlength = 9;
      this.formGroup.get('nombres')?.enable();
      this.formGroup.get('correoElectronico')?.enable();
      this.formGroup.get('apellidoPaterno')?.enable();
      this.formGroup.get('apellidoMaterno')?.enable();
      this.formGroup.get('numeroDocumento')?.enable();
    }

    if(value === "-"){
      this.desactivarInputsInit();
    }

   // this.formGroup.reset(this.createForm())
   

   this.createForm(value);

   if(value === TipoDocumento_DNI){
    this.formGroup.controls['digitoVerificacion'].setValidators([Validators.required])
    this.formGroup.controls['digitoVerificacion'].updateValueAndValidity()
   }else{
    this.formGroup.controls['digitoVerificacion'].setValidators(null)
    this.formGroup.controls['digitoVerificacion'].updateValueAndValidity()
   }

  }

  
  ActiveButton():boolean{

    if(this.formGroup.get('validateEmail')?.value == true){
      return true;
    }else{
      if( this.formGroup.get('tipoDocumento')?.invalid ||this.formGroup.get('numeroDocumento')?.invalid || this.formGroup.get('correoElectronico')?.invalid || this.formGroup.get('tipoDocumento')?.value == "-"){
        return true
      }
      else{
        return false;
      }

    }


  }



  async validarCorreoElectronico() {
    var validate = await this.executeAction('homeLogin'); 
    let request = {
      tipoDocumento : this.formGroup.get('tipoDocumento')?.value ,
      numeroDocumento : this.formGroup.get('numeroDocumento')?.value,
      correoElectronico : this.formGroup.get('correoElectronico')?.value,
      recaptcha : this.TOkenCaptcha
      }


    this.correoService.envioCorreoVerificacion(request).subscribe(res =>{

      if(res){
        const dialogRef = this.dialog.open(SharedDialogComponent, {
          width: "771px",
          height : "434px",  
          disableClose: true,
          data: {  idEnvio :res.idEnvio , requestData : request , email : this.formGroup.get('correoElectronico')?.value},
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.formGroup.get("validateEmail")?.setValue(result);
          if(result){
            this.formGroup.get('correoElectronico')?.disable();
          }

        });
        
      }else{
        this.dialog.open(AlertDialogComponent, {
          disableClose: true,
          hasBackdrop: true,
          data: {cabecera : 'Error!' ,messages: ['Error al  registrar']}
        })
      }

    });

  }

  invalidarDocumento() {
    this.numeroDniValido = false
  }
  // llenar9(){
  //   if(this.valueIniCelular=='') this.valueIniCelular='9'
  // }
  // onFocusOut9(event: any){
  //   if(this.valueIniCelular=='') this.valueIniCelular='9'
  // }
  // verificaVacio(){
  //   if(this.valueIniCelular=='') this.valueIniCelular='9'
  // }
  async validarDocumento() {

    if(this.getNumeroDoc().length != this.maxlength) return;

    this.loading = true;
    this.buscando = true;
    this.formGroup.get('numeroDocumento')?.disable();
    console.log('validando documento')
    const numeroDocumento = (this.formGroup.get('numeroDocumento')?.value ?? '') as string
    if (this.esTipoDocumentoDni  && numeroDocumento.length == 8) {

      var validate = await this.executeAction('homeLogin'); //  poner en true para desarrollo

      if(validate){
        let envio : ObtenerDatosPersonaDniDto = new ObtenerDatosPersonaDniDto();
        envio.dni = numeroDocumento;
        envio.recaptcha = this.TOkenCaptcha;
        //this.personaNaturalDni = await firstValueFrom(this.personaNaturalService.obtenerDatosPersona(envio))

        this.personaNaturalService.obtenerDatosPersona(envio).subscribe(res =>{
          if(res){
            this.personaNaturalDni = res;
            this.formGroup.patchValue({
              'nombres': this.personaNaturalDni.nombres,
              //'apellidos': this.personaNaturalDni.apellidos,
              'apellidoPaterno': this.personaNaturalDni.apellidoPaterno,
              'apellidoMaterno': this.personaNaturalDni.apellidoMaterno,
            });
            this.loading = false;
            this.buscando = false;
          this.blockInput = false;          
          this.numeroDniValido = true;
          }else{
            this.blockInput = true;
            this.loading = false;
            this.formGroup.get('numeroDocumento')?.enable();
            this.formGroup.get('tipoDocumento')?.enable();
            /*this.formGroup.get('apellidoPaterno')?.setValue(null);
            this.formGroup.get('apellidoMaterno')?.setValue(null);
            this.formGroup.get('nombres')?.setValue(null);*/
            this.dialog.open(AlertDialogComponent, {
              disableClose: true,
              hasBackdrop: true,
              data: {cabecera : 'Error' ,messages: ['No hubo respuesta, intente nuevamente en unos momentos.']}
            });
            return;
          }

        },error =>{
          let mensajeError = {cabecera : 'Advertencia', messages: ['Error al obtener información.']};
          if(error.error.statusCode == 401){
            mensajeError = {cabecera : 'No autorizado', messages: [error.error.message]};
          }
          if(error.error.statusCode == 404){
            mensajeError = {cabecera : 'Verifica si tu número de DNI ingresado es correcto.', messages: ['En caso sea correcto, te invitamos a presentar tu Solicitud mediante Mesa de Partes Física o Virtual.']};
          }
          this.blockInput = true;
          this.loading = false;
          this.formGroup.get('numeroDocumento')?.enable();
          this.formGroup.get('tipoDocumento')?.enable();
          this.dialog.open(AlertDialogComponent, {
            disableClose: true,
            hasBackdrop: true,
            data: mensajeError
          });
          return;
        })


        // console.log("PERSONAA", this.personaNaturalDni)
        // if (this.personaNaturalDni == null || this.personaNaturalDni == undefined) {
 
        // }else{
        //   this.loading = false;
        //   this.blockInput = false;
        // }
        // console.log(this.personaNaturalDni);
     
      }else{        
        this.dialog.open(AlertDialogComponent, {
          disableClose: true,
          hasBackdrop: true,
          data: {cabecera : 'Error' ,messages: ['No hubo respuesta, intente nuevamente en unos momentos.']}
        });
        return;
      }
 
    }
  }

  cargarPersona() {
    const tipoDocumento = this.formGroup.get('tipoDocumento')?.value ?? ''
    const numeroDocumento = this.formGroup.get('numeroDocumento')?.value ?? ''
    console.log('cargando dni para', tipoDocumento, numeroDocumento)
  }

  obtenerCorreo() {
    return this.formGroup.get('correoElectronico')?.value ?? ''
  }

  getNumeroDoc(){
    return this.formGroup.get('numeroDocumento')?.value ?? '';
  }

  get esTipoDocumentoDni() {
    return this.formGroup?.get('tipoDocumento')?.value == TipoDocumento_DNI
  }

  get esTipoDocumentoCE() {
    return this.formGroup?.get('tipoDocumento')?.value.codigo == TipoDocumento_CE
  }
  async cambiarProvincia() {
    this.formGroup.get("provincia")?.reset();
    this.formGroup.get("distrito")?.reset();
    this.provinciaList = [];
  
    var value  = this.formGroup.get('departamento')?.value.ubdep


    this.provinciaList = await firstValueFrom(this.ubigeoService.getProvinciaList(value))
    this.distritoList = []
    
  }

  get f(): { [key: string]: AbstractControl } {
    return this.formGroup.controls ;
  }

  async cambiarDistrito() {
    this.distritoList = [];
    this.formGroup.get("distrito")?.reset();
    var valueprovincia = this.formGroup.get('provincia')?.value.ubprv
    var valuedepar = this.formGroup.get('departamento')?.value.ubdep
    this.distritoList = await firstValueFrom(this.ubigeoService.getDistritoList(valuedepar, valueprovincia))
  }

  validarsoloNumeros(event : any): boolean{
    const charCode = (event.which) ? event.which : event.keyCode;
    const digitVer = this.formGroup.get('digitoVerificacion')?.value;
    if(digitVer == " "){
      this.formGroup.get("digitoVerificacion")?.setValue("");
    }
    var inp = String.fromCharCode(event.keyCode);
  
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
   }


   validarCelular(event : any): boolean{
    const charCode = (event.which) ? event.which : event.keyCode;
    const numCelular = this.formGroup.get('numeroCelular')?.value;
    var primerDigito = event.target.selectionStart;
    var primerdato = numCelular[0];
    if(primerDigito == 0   ){
      if(charCode == 57 ){
        return true;
      }else{
        return false;
      }
    }else{
      if( charCode > 31 && (charCode < 48 || charCode > 57)){
        return false;
      }else {
        return true;
      }
    }
   }

   validardomicilio(e : any, idInput: string){
    var value = this.formGroup.get('domicilioFisico')?.value;

    let inicio = this.renderer.selectRootElement(`#${idInput}`).selectionStart;
    let fin = this.renderer.selectRootElement(`#${idInput}`).selectionEnd;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if(inicio == 0 && e.key === ' ') return false;
    
    this.formGroup.get('domicilioFisico')?.setValue(value.replace(/ {2,}/g, ' '));
    this.renderer.selectRootElement(`#${idInput}`).setSelectionRange(inicio, fin, 'none');
      return true;
   }

   quitarDobleEspacio(idInput: string, e: any) {

    let inicio = this.renderer.selectRootElement(`#${idInput}`).selectionStart;
    let fin = this.renderer.selectRootElement(`#${idInput}`).selectionEnd;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if(inicio == 0 && e.key === ' ') return false;

    switch(idInput){
      case 'apellidoPaterno':
        var value = this.formGroup.get('apellidoPaterno')?.value;
        
      this.formGroup.get('apellidoPaterno')?.setValue(value.replace(/ {2,}/g, ' ')); break;
      case 'apellidoMaterno':
        var value = this.formGroup.get('apellidoMaterno')?.value;
      this.formGroup.get('apellidoMaterno')?.setValue(value.replace(/ {2,}/g, ' ')); break;
      case 'nombres':
        var value = this.formGroup.get('nombres')?.value;
      this.formGroup.get('nombres')?.setValue(value.replace(/ {2,}/g, ' ')); break; 
    }
  
    this.renderer.selectRootElement(`#${idInput}`).setSelectionRange(inicio, fin, 'none');

    return true;
  }


   validateInputKey(event : any): boolean{ console.log(event.keyCode);
    console.log("hola");

    var key = event.keyCode || event.which;
    var teclado = String.fromCharCode(key);
var numeros = "0123456789";
var especiales = [8,37,38,46];
var teclado_especial=false;
for(var i in especiales) {
  if(key==especiales[i]){
    teclado_especial=true;
  }
}
if(numeros.indexOf(teclado)==-1 && !teclado_especial){
  console.log("false");
  return false;
}

    /*const input = String.fromCharCode(event.keyCode);
    if (!/^[0-9]*$/.test(input)) {
        event.preventDefault();
        return false;
    }*/
    /*const charCode = (event.which) ? event.which : event.keyCode;
    //var inp = String.fromCharCode(event.keyCode);
      //if(this.maxlength >= 8){
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          return false;
        }
      //}*/
      console.log("true");
return true;
   }

   public recentToken = '';
   public recentError?: { error: any };
   private singleExecutionSubscription!: Subscription;
   private executeAction = async (action: string) => {
    return new Promise((resolve) => {
      if (this.singleExecutionSubscription) {
        this.singleExecutionSubscription.unsubscribe();
      }
      this.singleExecutionSubscription = this.reCaptchaV3Service
        .execute(action)
        .subscribe(
          (token) => {
            this.recentToken = token;
            this.recentError = undefined;
            this.TOkenCaptcha = token;
            this.formGroup.get("recaptchaReactive")?.setValue(this.TOkenCaptcha);
            resolve(true);
          },
          (error) => {
            this.recentToken = '';
            this.TOkenCaptcha = '';
            this.recentError = { error };
            resolve(false);
          }
        );
    });
  };
}
