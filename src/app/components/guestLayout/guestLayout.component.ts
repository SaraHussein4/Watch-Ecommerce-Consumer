import { Component, OnInit } from '@angular/core';
import { NavbarComponentComponent } from "../navbar-component/navbar-component.component";
import { RouterOutlet } from '@angular/router';
import { FooterComponentComponent } from "../footer-component/footer-component.component";
@Component({
  selector: 'app-guestLayout',
  templateUrl: './guestLayout.component.html',
  styleUrls: ['./guestLayout.component.css'],
  imports: [NavbarComponentComponent, RouterOutlet]
})
export class GuestLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
