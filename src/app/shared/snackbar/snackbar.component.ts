import { Component, OnDestroy, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'snackbar-component',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent {
    message: string = ''
    closeButtonLabel: string = 'Fermer'

    constructor(
        @Inject(MAT_SNACK_BAR_DATA) public data: any,
        private ref: MatSnackBarRef<SnackbarComponent>
    ) {
        this.message = this.uppercaseFirstLetter(data.message.replace(/(\n)/g, '<br>'))
        this.closeButtonLabel = this.uppercaseFirstLetter(data.closeButtonLabel || 'Fermer')
    }

    close(){
        this.ref.dismiss()
    }

    uppercaseFirstLetter(message: string) {
      return message[0].toUpperCase() + message.substring(1)
    }

}
