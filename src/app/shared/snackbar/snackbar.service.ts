import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from './snackbar.component';

@Injectable()
export class SnackbarService {

	constructor(public snackBar: MatSnackBar) {}

  openSuccess(message: string): void {
    this.snackBar.openFromComponent(SnackbarComponent, {
      duration: 3000,
      panelClass: ['snackbar-success'],
      data: {
        message,
        closeButtonLabel: 'Close'
      }
    });
  }

  openError(message: string): void {
    this.snackBar.openFromComponent(SnackbarComponent, {
      duration: 3000,
      panelClass: ['snackbar-error'],
      data: {
        message,
        closeButtonLabel: 'Close'
      }
    });
  }

}
