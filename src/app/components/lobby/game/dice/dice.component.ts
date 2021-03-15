import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.scss']
})
export class DiceComponent implements OnInit {

  @Input('number') number: number
  @Input('isSelected') isSelected: boolean

  constructor() { }

  ngOnInit(): void {
  }

}
