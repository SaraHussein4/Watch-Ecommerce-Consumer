import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer-component',
  imports: [RouterLink],
  templateUrl: './footer-component.component.html',
  styleUrl: './footer-component.component.css'
})
export class FooterComponentComponent {
currentYear: number = new Date().getFullYear();

}
