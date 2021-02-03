import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'error',
  template: ''
})
export class ErrorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: `Coś poszło nie tak! Spróbuj ponownie za chwilę!`,
    })
  }

}
