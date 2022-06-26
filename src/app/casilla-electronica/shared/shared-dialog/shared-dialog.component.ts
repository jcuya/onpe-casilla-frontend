import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-shared-dialog',
  templateUrl: './shared-dialog.component.html',
  styleUrls: ['./shared-dialog.component.css']
})
export class SharedDialogComponent implements OnInit {
  formGroup!: FormGroup;
  titleForm = "Validación de correo electrónico"
  info = "Ingresa a tu bandeja principal o bande de no deseados, porque hemos enviado un coreo electrónico con un código de verficiación, ingresalo aquí."

  listCodVerifica = [6,6,6,6,6,6]


  constructor( @Inject(MAT_DIALOG_DATA) private data : any,
  private dialogRef: MatDialogRef<SharedDialogComponent>,
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
  }

  validarsoloNumeros(event : any): boolean{
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
    
   }


  cancel( resp: boolean) {
    this.dialogRef.close(resp);
  }

  valid(){
    if(this.formGroup.valid){
      var listArrayHtml ;
       listArrayHtml = [
        Number(this.formGroup.get('codigo1')?.value),
        Number(this.formGroup.get('codigo2')?.value),
        Number(this.formGroup.get('codigo3')?.value),
        Number(this.formGroup.get('codigo4')?.value),
        Number(this.formGroup.get('codigo5')?.value),
        Number(this.formGroup.get('codigo6')?.value)
      ]

    if(this.listCodVerifica[0] == listArrayHtml[0] &&
       this.listCodVerifica[1] == listArrayHtml[1] && 
       this.listCodVerifica[2] == listArrayHtml[2] &&
       this.listCodVerifica[3] == listArrayHtml[3] &&
       this.listCodVerifica[4] == listArrayHtml[4] &&
       this.listCodVerifica[5] == listArrayHtml[5] ){

       

        this.dialog.open(AlertDialogComponent, {
          disableClose: true,
          hasBackdrop: true,
          data: {cabecera : 'Verificación' ,messages: ['Código validado correctamente']}
        }).afterClosed().subscribe(result =>{
          this.cancel(true);
        });

    }else{

      this.dialog.open(AlertDialogComponent, {
        disableClose: true,
        hasBackdrop: true,
        data: {cabecera : 'Error!' ,messages: ['Error al  validar código']}
      }).afterClosed().subscribe(result =>{
        this.cancel(false);
      });
    }
  }
}

}