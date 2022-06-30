import { Component, Inject, OnInit,ElementRef ,ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-shared-dialog',
  templateUrl: './shared-dialog.component.html',
  styleUrls: ['./shared-dialog.component.css']
})
export class SharedDialogComponent implements OnInit ,AfterViewInit  {
  @ViewChild('input1') input1 !: ElementRef ;
  formGroup!: FormGroup;
  titleForm = "Validación de correo electrónico"
  info = "Ingresa a tu bandeja principal o bandeja de no deseados, ya que te hemos enviado un correo electrónico con un código de verificación, el cual debes ingresarlo aquí:"

  listCodVerifica = [6,6,6,6,6,6]
  listArrayHtml: Number[]= [];
  respuesta : boolean = false;

  constructor( @Inject(MAT_DIALOG_DATA) private data : any,
  private dialogRef: MatDialogRef<SharedDialogComponent>,
  private dialogRefmessage: MatDialogRef<AlertDialogComponent>,
  private formBuilder: FormBuilder,
  public dialog: MatDialog
  ) { }

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

  ngAfterViewInit(): void {
    this.input1.nativeElement.focus();
  }

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
      
       this.listArrayHtml = [
        Number(this.formGroup.get('codigo1')?.value),
        Number(this.formGroup.get('codigo2')?.value),
        Number(this.formGroup.get('codigo3')?.value),
        Number(this.formGroup.get('codigo4')?.value),
        Number(this.formGroup.get('codigo5')?.value),
        Number(this.formGroup.get('codigo6')?.value)
      ]

    if(this.listCodVerifica[0] == this.listArrayHtml[0] &&
       this.listCodVerifica[1] == this.listArrayHtml[1] && 
       this.listCodVerifica[2] == this.listArrayHtml[2] &&
       this.listCodVerifica[3] == this.listArrayHtml[3] &&
       this.listCodVerifica[4] == this.listArrayHtml[4] &&
       this.listCodVerifica[5] == this.listArrayHtml[5] ){

       

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
        data: {cabecera : 'Error' ,messages: ['Error al  validar código']}
      }).afterClosed().subscribe(result =>{
        this.respuesta = false;
        //this.input1.nativeElement.focus();
        this.autoFocus();
      });

    }
  }
}

get primerDigito() {
  return this.formGroup.get('codigo1')?.value || null;
}

}