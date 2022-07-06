import {NgModule} from "@angular/core";
import {AppComponent} from "../app.component";
import {DndDirective} from "./dnd.directive";

@NgModule({
  declarations: [
    DndDirective,
  ],
  imports: [
  ],
  providers: [],
  exports: [
    DndDirective
  ],
  bootstrap: [AppComponent]
})
export class DirectiveModule { }
