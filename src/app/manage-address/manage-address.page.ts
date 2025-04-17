import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-manage-address',
  templateUrl: './manage-address.page.html',
  styleUrls: ['./manage-address.page.scss'],
})
export class ManageAddressPage implements OnInit {

  constructor(private route: Router) { }

  ngOnInit() {
  }


  add_address() {
    this.route.navigate(['./add-address']);
  }
}
