import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingDataComponent } from './common/loading-data/loading-data.component';
import { ErrorComponent } from './common/error/error.component';

@NgModule({
  declarations: [
    LoadingDataComponent,
    ErrorComponent
  ],
  exports: [
    LoadingDataComponent,
    ErrorComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
