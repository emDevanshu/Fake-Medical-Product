import {ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule, NgClass} from '@angular/common';

@Component({
  selector: 'app-popup-dialog',
  imports: [
    NgClass, CommonModule
  ],
  templateUrl: './popup-dialog.html',
  styleUrl: './popup-dialog.css'
})
export class PopupDialogComponent {
  show = false;
  title = '';
  message = '';
  success = false;
  isLoading = false;
  loadingMessage = '';

  @Output() closed = new EventEmitter<void>();

  constructor(private cdr : ChangeDetectorRef) {
  }

  open(data: { success: boolean, message: string }) {
    this.isLoading = false;
    this.success = data.success;
    this.title = data.success ? "Transaction Successful!" : "Transaction Failed!";
    this.message = data.message;
    this.show = true;
    this.cdr.detectChanges();
  }

  close() {
    this.show = false;
    this.closed.emit();
  }

  openLoading(message: string) {
    this.isLoading = true;
    this.loadingMessage = message;
    this.show = true;
    this.cdr.detectChanges();
  }
}
