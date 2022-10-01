import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FileUploadControl, FileUploadValidators } from '@iplab/ngx-file-upload';
import { Subscription } from 'rxjs';
import { requestGlobal } from 'src/app/core/dto/request';
import { CasillaService } from 'src/app/core/services/casilla.service';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-foto-dni',
  templateUrl: './foto-dni.component.html',
  styleUrls: ['./foto-dni.component.css']
})
export class FotoDniComponent implements OnInit {

  @Output() completedStep = new EventEmitter<any>()
  @Output() previousStep = new EventEmitter<any>()
  maxsize_ = 3242880;


  observableRequestSubscription!: Subscription;
  requestSave: requestGlobal = new requestGlobal();

  formGroup!: FormGroup;
  constructor( private formBuilder: FormBuilder,private casillaService: CasillaService,private dialog: MatDialog) {

    this.observableRequestSubscription = casillaService.casilla$.subscribe(
      (requestSave: requestGlobal) => {
        this.requestSave = requestSave;
        //if (requestSave) this.companyId = requestSave;
      }
    );
   }




  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      files: this.filesControl
    });
  }



 
  handleArchivoAgregado(event: any) {
    console.log(event)
    this.formGroup.get('file')?.setValue(event)
  }

  regresar() {
    this.previousStep.emit()
  }

  continuar() {
    if(!this.formGroup.valid){
    
      this.formGroup.markAllAsTouched()
      return
    }

    this.requestSave.file = this.formGroup.controls['files'].value[0];
    this.casillaService.setCasilla(this.requestSave);
    
    this.completedStep.emit()
  }


  public filesControl = new FormControl( null, [
    Validators.required,
    FileUploadValidators.accept(['image/*']),
    FileUploadValidators.filesLimit(1),
    FileUploadValidators.fileSize(this.maxsize_),
   // this.noWhitespaceValidator,
  ]);


  get f(): { [key: string]: AbstractControl } {
    return this.formGroup.controls ;
  }


  validatorImage(){
    const Image = this.f.files.value[0]

    if(Image.size >= this.maxsize_){
      this.dialog.open(AlertDialogComponent, {
        disableClose: true,
        hasBackdrop: true,
        data: {cabecera : 'Error!' ,messages: ['La imagen debe tener un peso máximo de 3Mb']}
      })
      this.filesControl.setValue([]);

    }
    var data = Image.type.split('/');

    const type =  data[0]; // Image.type.substr(0,5)
    const extencion = data[1];





    if(type !== "image" || !this.admitExtention(extencion)){
      this.dialog.open(AlertDialogComponent, {
        disableClose: true,
        hasBackdrop: true,
        data: {cabecera : 'Error!' ,messages: ['El archivo debe ser de tipo imagen  (PNG, JPG o JPEG)']}
      })
      this.filesControl.setValue([]);
    }
    return;
   // this.f.files.setValue(null)
    //  this.formGroup.get('files')?.setValue(null);


   }

   admitExtention(ext : string){

    if(ext === "png" || ext === "jpg" || ext === "jpeg" ){
      return true;
    }else{
      return false;
    }


   }

}
