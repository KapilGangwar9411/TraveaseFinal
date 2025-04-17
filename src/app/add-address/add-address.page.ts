import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular'
@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.page.html',
  styleUrls: ['./add-address.page.scss'],
})
export class AddAddressPage implements OnInit {
  fabAction = false;
  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  toggleFab() {
    this.fabAction = !this.fabAction;
  }

  save() {
    this.navCtrl.pop();
  }
}
