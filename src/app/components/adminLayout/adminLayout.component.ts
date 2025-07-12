import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "../Sidebar/Sidebar.component";
import { FooterComponentComponent } from "../footer-component/footer-component.component";
@Component({
  selector: 'app-adminLayout',
  templateUrl: './adminLayout.component.html',
  styleUrls: ['./adminLayout.component.css'],
  imports: [RouterOutlet, SidebarComponent]
})
export class AdminLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
