import {ChangeDetectorRef, Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {Html5Qrcode} from 'html5-qrcode';
import {Web3Service} from '../../services/web3.service';

@Component({
  selector: 'app-product-verification',
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './product-verification.html',
  styleUrl: './product-verification.css',
})
export class ProductVerificationComponent {
  loading : boolean = false;
  consumerID! : string;
  productSN : string = '';
  qrScanned = false;
  cameraRunning: boolean = false;
  actualConsumer = '';
  isVerified = false;
  verificationDone = false;
  private html5QrCode?: Html5Qrcode;

  constructor(private web3Service : Web3Service, private cdr : ChangeDetectorRef) {
  }

  async verifyProduct() {
    if (!this.productSN || !this.consumerID) {
      alert('Please fill both fields.');
      return;
    }

    this.loading = true;
    try {
      const result = await this.web3Service.verifyProduct(this.productSN, this.consumerID);
      this.isVerified = result.isVerified;
      this.actualConsumer = result.actualConsumer;
      this.verificationDone = true;
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  resetVerification() {
    this.productSN = '';
    this.consumerID = '';
    this.verificationDone = false;
    this.isVerified = false;
    this.actualConsumer = '';
    this.cdr.detectChanges();
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

  playBeepSound() {
    var beepSound = new Audio('../../../assets/beep.wav');
    beepSound.play();
  }
}
