import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ConfirmDelete',
  templateUrl: './ConfirmDelete.component.html',
  styleUrls: ['./ConfirmDelete.component.css']
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
