import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'frontend_create_casilla';

  @ViewChild('principal') elementView!: ElementRef;

  contentHeight!: number;


  ngOnInit(){
    
  }

  ngAfterViewInit() {
    this.contentHeight = this.elementView.nativeElement.offsetHeight;

    if( this.contentHeight >= 370){

    }

    console.log("tamaño", this.contentHeight)
}

}
