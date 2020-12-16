import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'loading-data',
  template: `
    <div class="d-flex justify-content-center">
      <div class="spinner-border my-2 text-light" role="status">
        <span class="sr-only"></span>
      </div>
    </div>
`
})
export class LoadingDataComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
