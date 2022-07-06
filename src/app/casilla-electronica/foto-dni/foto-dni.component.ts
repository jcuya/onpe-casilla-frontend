import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { Subscription } from 'rxjs';
import { requestGlobal } from 'src/app/core/dto/request';
import { CasillaService } from 'src/app/core/services/casilla.service';

@Component({
  selector: 'app-foto-dni',
  templateUrl: './foto-dni.component.html',
  styleUrls: ['./foto-dni.component.css']
})
export class FotoDniComponent implements OnInit {

  @Output() completedStep = new EventEmitter<any>()
  @Output() previousStep = new EventEmitter<any>()


  observableRequestSubscription!: Subscription;
  requestSave: requestGlobal = new requestGlobal();

  formGroup!: FormGroup;
  constructor( private formBuilder: FormBuilder,private casillaService: CasillaService) {

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


  public filesControl = new FormControl(null, [
    Validators.required,
    FileUploadValidators.accept(['file_extension|image/*']),
    FileUploadValidators.filesLimit(1),
    FileUploadValidators.fileSize(1048576 * 10),
   // this.noWhitespaceValidator,
  ]);

}
