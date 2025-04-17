import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pool-takers',
  templateUrl: './pool-takers.page.html',
  styleUrls: ['./pool-takers.page.scss'],
})
export class PoolTakersPage implements OnInit {

  constructor(private route: Router) { }

  ngOnInit() {
  }

  poolTakerInfo() {
    this.route.navigate(['./pool-taker-info']);
  }
}
