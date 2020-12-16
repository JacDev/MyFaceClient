import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingDataComponent } from './common/loading-data/loading-data.component';



@NgModule({
  declarations: [
    LoadingDataComponent
  ],
  exports:[
    LoadingDataComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
