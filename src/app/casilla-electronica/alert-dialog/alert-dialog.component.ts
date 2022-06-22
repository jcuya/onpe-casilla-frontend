import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

class DialogData {
  messages: string[] = [];
  cabecera : string = 'Validación de documento de persona'
}

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.css']
})
export class AlertDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
  }

  ngOnInit(): void {
  }

  aceptar(){
    this.dialogRef.close()
  }
}
