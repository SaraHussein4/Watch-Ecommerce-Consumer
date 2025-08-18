import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmDelete',
  templateUrl: './confirmDelete.component.html',
  styleUrls: ['./confirmDelete.component.css']
})
export class ConfirmDeleteComponent  {

  title = '';
  message = '';

  constructor(public activeModal: NgbActiveModal) {}

  confirm() {
    this.activeModal.close('confirm');
  }

  dismiss() {
    this.activeModal.dismiss();
  }

}
