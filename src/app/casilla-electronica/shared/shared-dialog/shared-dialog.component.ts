import { Component, Inject, OnInit,ElementRef ,ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValidarCorreoService } from 'src/app/core/services/validar-correo.service';
import { AlertDialogComponent } from '../../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-shared-dialog',
  templateUrl: './shared-dialog.component.html',
  styleUrls: ['./shared-dialog.component.css']
})
export class SharedDialogComponent implements OnInit   {
  @ViewChild('input1') input1 !: ElementRef ;
  formGroup!: FormGroup;
  titleForm = "Validación de correo electrónico"
  info = "Ingresa a tu bandeja principal o bandeja de no deseados, ya que te hemos enviado un correo electrónico con un código de verificación, el cual debes ingresarlo aquí:"


  respuesta : boolean = false;
  blockbtnTimmer: boolean = false;
  idEnvio !: number;
  tipoDocumento !: string;
  numeroDocumento !: string;
  email !: string;
  interval : any;
  timeLeft: number = 30;

  constructor( @Inject(MAT_DIALOG_DATA) private data : any,
  private dialogRef: MatDialogRef<SharedDialogComponent>,
  private dialogRefmessage: MatDialogRef<AlertDialogComponent>,
  private correoService : ValidarCorreoService,
  private formBuilder: FormBuilder,
  public dialog: MatDialog
  ) {
    this.idEnvio = data.idEnvio;
    this.tipoDocumento = data.requestData.tipoDocumento;
    this.numeroDocumento = data.requestData.numeroDocumento
    this.email = data.email;
   }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      codigo1: ['', Validators.required],
      codigo2: ['', Validators.required],
      codigo3: ['', Validators.required],
      codigo4: ['', Validators.required],
      codigo5: ['', Validators.required],
      codigo6: ['', Validators.required],
    })
   // this.autoFocus();
  }

  // ngAfterViewInit(): void {
  //   this.input1.nativeElement.focus();
  // }

  validarsoloNumeros(event : any): boolean{
   
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57 || charCode == 9)) {
      return false;
    }
    return true;
    
   }

   autoFocus(){
    this.input1.nativeElement.focus();
   }


  cancel( resp: boolean) {
    this.dialogRef.close(resp);
  }

  valid(){
    if(this.formGroup.valid){
      
      var codigoEnvio = this.formGroup.get('codigo1')?.value + this.formGroup.get('codigo2')?.value + this.formGroup.get('codigo3')?.value + this.formGroup.get('codigo4')?.value + this.formGroup.get('codigo5')?.value +  this.formGroup.get('codigo6')?.value
      let request = {
        tipoDocumento: this.tipoDocumento,
        numeroDocumento: this.numeroDocumento,
        idEnvio: this.idEnvio,
        codigo: codigoEnvio.toUpperCase(),
        correo: this.email,
      }

      this.correoService.validarCodigoVerificacion(request).subscribe(respuesta =>{
      if(respuesta.esValido){
        this.dialog.open(AlertDialogComponent, {
          disableClose: true,
          hasBackdrop: true,
          data: {cabecera : 'Verificación' ,messages: ['Código validado correctamente']}
        }).afterClosed().subscribe(result =>{
          this.respuesta = true;
          this.cancel(true);
        });
      }else{

        this.dialog.open(AlertDialogComponent, {
          disableClose: true,
          hasBackdrop: true,
          data: {cabecera : 'Advertencia' ,messages: [respuesta.mensaje]}
        }).afterClosed().subscribe(result =>{
          this.respuesta = false;
          //this.input1.nativeElement.focus();
          this.autoFocus();
        });
      }

      })

  }
}

reenvio(){

  let request = {
    tipoDocumento : this.tipoDocumento ,
    numeroDocumento : this.numeroDocumento,
    correoElectronico : this.email
    }


  this.correoService.envioCorreoVerificacion(request).subscribe(res =>{

    if(res){

      this.idEnvio = res.idEnvio; 
      
    }else{
      this.dialog.open(AlertDialogComponent, {
        disableClose: true,
        hasBackdrop: true,
        data: {cabecera : 'Error!' ,messages: ['Error servicio']}
      })
    }

    if(!this.blockbtnTimmer){
      this.blockbtnTimmer = true;
      setTimeout(()=>{
       this.blockbtnTimmer = false;
    }, 30000)
    this.startTimer();
    }

  });
}

startTimer() {
  this.interval = setInterval(() => {
    if(this.timeLeft > 0) {
      this.timeLeft--;
    } else if(this.timeLeft == 0) {
    clearInterval(this.interval)
    this.timeLeft = 30;
    }
  },1000)
}

get primerDigito() {
  return this.formGroup.get('codigo1')?.value || null;
}

}