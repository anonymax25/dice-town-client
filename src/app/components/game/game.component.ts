import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";


declare const print: any;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit() {

  }

  leaveGame() {
    this.router.navigate(['home']);
  }
}
