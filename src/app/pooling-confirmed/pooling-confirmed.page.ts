import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular'
@Component({
  selector: 'app-pooling-confirmed',
  templateUrl: './pooling-confirmed.page.html',
  styleUrls: ['./pooling-confirmed.page.scss'],
})
export class PoolingConfirmedPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  my_trips() {
    this.navCtrl.navigateRoot(['./tabs']);
  }
}
