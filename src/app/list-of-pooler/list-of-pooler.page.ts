import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-of-pooler',
  templateUrl: './list-of-pooler.page.html',
  styleUrls: ['./list-of-pooler.page.scss'],
})
export class ListOfPoolerPage implements OnInit {

  constructor(private route: Router) { }

  ngOnInit() {
  }

  pool_info() {
    this.route.navigate(['./pool-info']);
  }
}
