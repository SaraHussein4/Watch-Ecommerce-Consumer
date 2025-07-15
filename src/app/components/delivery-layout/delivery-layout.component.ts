import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DeliverySidebarComponent } from '../delivery-sidebar/delivery-sidebar.component';


@Component({
  selector: 'app-delivery-layout',
  templateUrl: './delivery-layout.component.html',
  styleUrls: ['./delivery-layout.component.css'],
  standalone: true,
  imports: [RouterOutlet, DeliverySidebarComponent]
})
export class DeliveryLayoutComponent {} 