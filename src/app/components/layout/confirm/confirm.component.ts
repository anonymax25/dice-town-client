import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

  constructor(public dialog: MatDialogRef<ConfirmComponent>) { }

  ngOnInit(): void {
  }

  confirm() {
    this.dialog.close(true);
  }
  
  decline() {
    this.dialog.close(false);
  }
}
