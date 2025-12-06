import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {Web3Service} from '../../services/web3.service';
import {Html5Qrcode} from 'html5-qrcode';
import {PopupDialogComponent} from '../../shared/popup-dialog/popup-dialog';

@Component({
  selector: 'app-sell-product-to-consumer',
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    PopupDialogComponent
  ],
  templateUrl: './sell-product-to-consumer.html',
  styleUrl: './sell-product-to-consumer.css',
})
export class SellProductToConsumerComponent {
  productSN: string = '';
  private html5QrCode?: Html5Qrcode;
  cameraRunning: boolean = false;
  consumerID! : string;
  qrScanned = false;
  showSuccessPopup = false;
  loadingQR: boolean = false;

  @ViewChild('popup') popup!: PopupDialogComponent;

  constructor(private web3Service : Web3Service, private cdr: ChangeDetectorRef) {
  }
  async sellToConsumer(): Promise<void> {
    this.loadingQR = true;
    try {
      if (!this.productSN) {
        alert('Please scan a product QR first.');
        return;
      }

      if (!this.consumerID) {
        alert('Please enter a seller code.');
        return;
      }

      const success = await this.web3Service.sellerSellProduct(this.productSN, this.consumerID);

      if (success) {
        console.log('✅ Showing success popup');
        this.showSuccessPopup = true; // ✅ Show popup on success
        this.cdr.detectChanges();
      } else {
        alert('Transaction failed. Please try again.');
      }
    } catch (error: any) {
      if (error.message) {
        this.popup.open({
          success: false,
          message: error.message || "Something went wrong"
        });
      } else {
        console.error('❌ Error selling product:', error);
        alert('Transaction failed. Check console for details.');
      }
    } finally {
      this.loadingQR = false;
      this.cdr.detectChanges();
    }
  }

  startCameraScan(): void {
    this.cameraRunning = true;
    this.qrScanned = false;
    setTimeout(() => {
      const qrRegionId = 'qr-reader';

      if (this.html5QrCode) {
        try {
          this.html5QrCode.stop().catch(() => {
          });
        } catch {
        }
        this.html5QrCode = undefined;
      }

      this.html5QrCode = new Html5Qrcode(qrRegionId);

      const qrCodeSuccessCallback = (decodedText: string) => {
        this.playBeepSound();
        this.productSN = decodedText;
        this.stopCamera(true);
      };

      const config = {fps: 10, qrbox: 250};

      Html5Qrcode.getCameras()
        .then((devices) => {
          if (devices && devices.length) {
            const cameraId = devices[0].id;

            this.html5QrCode
              ?.start(cameraId, config, qrCodeSuccessCallback, (errorMessage) => {
                console.warn('QR Code scan error:', errorMessage);
              })
              .catch((err) => console.error('Camera start error:', err));
          } else {
            alert('No camera found on this device.');
          }
        })
        .catch((err) => console.error('Camera error:', err));
    });
  }

  stopCamera(qrScanned: boolean = false): void {
    if (this.html5QrCode) {
      this.html5QrCode
        .stop()
        .then(() => {
          this.qrScanned = qrScanned;
          this.cameraRunning = false;
          this.html5QrCode = undefined;
        })
        .catch((err) => console.warn('Stop camera error:', err));
    } else {
      this.cameraRunning = false;
    }
  }

  clearPreview(): void {
    this.productSN = '';
    this.qrScanned = false;
    this.cameraRunning = false;
  }

  goBack() {
    window.history.back();
  }

  closeSuccessPopup(): void {
    this.showSuccessPopup = false;
    this.goBack(); // ✅ Redirect one page back
  }

  playBeepSound() {
    var beepSound = new Audio('../../../assets/beep.wav');
    beepSound.play();
  }
}
