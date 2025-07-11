import { Component, OnInit } from '@angular/core';
import { NavbarComponentComponent } from "../navbar-component/navbar-component.component";
import { RouterOutlet } from '@angular/router';
import { FooterComponentComponent } from "../footer-component/footer-component.component";

@Component({
  selector: 'app-customerLayout',
  templateUrl: './customerLayout.component.html',
  styleUrls: ['./customerLayout.component.css'],
  imports: [NavbarComponentComponent, RouterOutlet]
})
export class CustomerLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
