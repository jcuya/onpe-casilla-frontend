import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Condicion_Persona_Natural, TipoDocumento, TipoDocumento_DNI} from "../../core/dto/documento";
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

  numeroDniValido: Boolean | undefined = undefined
  personaNaturalDni: PersonaNaturalDni | null = null;
  valueIniCelular: String = '9';

  //@Output() FormValidNatural = new EventEmitter<any>()
   maxlength : number = 8;

   sitekey = '';
   RequerdCaptcha: boolean = true;
   captchaView!: boolean;
   TOkenCaptcha: string = '';




  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private casillaService: CasillaService,
    private correoService : ValidarCorreoService,
    private ubigeoService: UbigeoService,
    private personaNaturalService: PersonaNaturalService,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private reCaptchaV3Service: ReCaptchaV3Service
  ) {
    this._locale = 'es';
    this._adapter.setLocale(this._locale);
    this.sitekey =  environment.KeycodeCaptcha;
  }

  async ngOnInit() {
    this.formGroup = this.formBuilder.group({
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
      apellidos: ['', Validators.required],
      nombres: ['', Validators.required],
      nombrePadre: ['', Validators.required],
      nombreMadre: ['', Validators.required],
      fechaNacimento: ['', Validators.required],
      digitoVerificacion: ['', Validators.required],
      correoElectronico: ['',[ Validators.required, Validators.email]],
      numeroCelular: ['', Validators.required],
      departamento: ['', Validators.required],
      provincia: ['', Validators.required],
      distrito: ['', Validators.required],
      domicilioFisico: ['', Validators.required],
      validateEmail : [false, Validators.required],
      recaptchaReactive: this.formBuilder.control(''),
    })
    this.tipoDocumentoList = await firstValueFrom(this.casillaService.getTipoDocumentoList(Condicion_Persona_Natural))
    this.departamentoList = await firstValueFrom(this.ubigeoService.getDepartamentoList())
    
  }

  tipoDocumentoCambiado(value: TipoDocumento) {
    this.invalidarDocumento();

    this.formGroup.get("nombres")?.setValue("");
    this.formGroup.get("apellidos")?.setValue("");

    if (value.codigo == TipoDocumento_DNI) {
      this.maxlength = 8;
      this.formGroup.get('nombres')?.disable();
      this.formGroup.get('apellidos')?.disable();
    } else {
      this.maxlength =9
      this.formGroup.get('nombres')?.enable();
      this.formGroup.get('apellidos')?.enable();

      this.formGroup.get("nombreMadre")?.setValue(" ");
      this.formGroup.get("nombrePadre")?.setValue(" ");
      this.formGroup.get("digitoVerificacion")?.setValue(" ");


    }
  }
  ActiveButton():boolean{

    if(this.formGroup.get('validateEmail')?.value == true){
      return true;
    }else{
      if( this.formGroup.get('tipoDocumento')?.invalid ||this.formGroup.get('numeroDocumento')?.invalid || this.formGroup.get('correoElectronico')?.invalid ){
        return true
      }
      else{
        return false;
      }

    }


  }



  validarCorreoElectronico() {

    let request = {
      tipoDocumento : this.formGroup.get('tipoDocumento')?.value.codigo ,
      numeroDocumento : this.formGroup.get('numeroDocumento')?.value,
      correoElectronico : this.formGroup.get('correoElectronico')?.value
      }


    this.correoService.envioCorreoVerificacion(request).subscribe(res =>{

      if(res){
        const dialogRef = this.dialog.open(SharedDialogComponent, {
          width: "700px",
          disableClose: false,
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
  llenar9(){
    if(this.valueIniCelular=='') this.valueIniCelular='9'
  }
  onFocusOut9(event: any){
    if(this.valueIniCelular=='') this.valueIniCelular='9'
  }
  verificaVacio(){
    if(this.valueIniCelular=='') this.valueIniCelular='9'
  }
  async validarDocumento() {
    console.log('validando documento')
    const numeroDocumento = (this.formGroup.get('numeroDocumento')?.value ?? '') as string
    if (this.esTipoDocumentoDni && numeroDocumento.length == 8) {

      var validate = await this.executeAction('homeLogin');

      if(validate){
        let envio : ObtenerDatosPersonaDniDto = new ObtenerDatosPersonaDniDto();
        envio.dni = numeroDocumento;
        envio.recaptcha = this.TOkenCaptcha;
        this.personaNaturalDni = await firstValueFrom(this.personaNaturalService.obtenerDatosPersona(envio))
        if (this.personaNaturalDni == null) {
          this.dialog.open(AlertDialogComponent, {
            disableClose: true,
            hasBackdrop: true,
            data: {cabecera : 'Verifica si tu número de DNI ingresado es correcto.' ,messages: ['En caso sea correcto, te invitamos a presentar tu Solicitud mediante Mesa de Partes Física o Virtual.']}
          });
          return;
        }
        console.log(this.personaNaturalDni);
        this.formGroup.patchValue({
          'nombres': this.personaNaturalDni.nombres,
          'apellidos': this.personaNaturalDni.apellidos,
        });
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

  get esTipoDocumentoDni() {
    return this.formGroup?.get('tipoDocumento')?.value.codigo == TipoDocumento_DNI
  }

  async cambiarProvincia(value: Departamento) {
    this.provinciaList = await firstValueFrom(this.ubigeoService.getProvinciaList(value.ubdep))
    this.distritoList = []
  }

  async cambiarDistrito(value: Provincia) {
    this.distritoList = await firstValueFrom(this.ubigeoService.getDistritoList(value.ubdep, value.ubprv))
  }

  validarsoloNumeros(event : any): boolean{
    const charCode = (event.which) ? event.which : event.keyCode;
    var inp = String.fromCharCode(event.keyCode);
    if (this.maxlength == 8){
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
    }
    if (this.maxlength == 9){
      if (/[a-zA-Z0-9]/.test(inp)) {
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    }
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
