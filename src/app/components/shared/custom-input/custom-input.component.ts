import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  imports: [FormsModule, NgIf],
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.css'
})
export class CustomInputComponent {
  @Input() label: string = '';
  @Input() value: string | number = '';
  @Input() placeholder: string = '';
  @Input() type: 'text' | 'email' | 'password' |'number' = 'text';
  @Input() isRequired: boolean = false;
  @Output() valueChange = new EventEmitter<string | number>();
  // showPassword = false;
  // toggleVisibility() {
  //   this.showPassword = !this.showPassword;
  // }

}
