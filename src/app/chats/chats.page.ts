import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {
  // segment = 0;
  // @ViewChild('slides', { static: true }) slider: IonSlides;

  constructor(private route: Router) { }

  ngOnInit() {
  }

  // async segmentChanged() {
  //   await this.slider.slideTo(this.segment);
  // }

  // async slideChanged() {
  //   this.segment = await this.slider.getActiveIndex();
  // }

  conversation() {
    this.route.navigate(['./conversation']);
  }
}
