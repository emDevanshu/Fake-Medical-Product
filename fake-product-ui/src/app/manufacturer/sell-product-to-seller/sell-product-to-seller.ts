import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Web3Service} from '../../services/web3.service';
import {AuthService} from '../../services/auth.service';
import {Html5Qrcode} from 'html5-qrcode';
import {NgClass, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {PopupDialogComponent} from '../../shared/popup-dialog/popup-dialog';

@Component({
  selector: 'app-sell-product-to-seller',
  imports: [
    NgIf,
    FormsModule,
    PopupDialogComponent,
  ],
  templateUrl: './sell-product-to-seller.html',
  styleUrl: './sell-product-to-seller.css',
})
export class SellProductToSellerComponent implements OnInit{

  constructor(private web3Service: Web3Service, private authService: AuthService, private cdr : ChangeDetectorRef) {}

  manufacturerID!: string;
  productSN : string = '';
  sellerCode! : string;
  private html5QrCode?: Html5Qrcode;
  cameraRunning: boolean = false;
  uploadMode = false;
  uploading = false;
  previewImage: string | null = null;
  qrScanned = false;

  @ViewChild('popup') popup!: PopupDialogComponent;

  ngOnInit() {
    const mid = this.authService.getManufacturerId();
    if (mid) this.manufacturerID = mid;
    else alert('Manufacturer ID not found! Please log in again.');
  }

  async sellToSeller(): Promise<void> {
    try {
      if (!this.productSN) {
        alert('Please scan a product QR first.');
        return;
      }

      if (!this.sellerCode) {
        alert('Please enter a seller code.');
        return;
      }
      const success = await this.web3Service.manufacturerSellProduct(this.productSN, this.sellerCode, this.manufacturerID);

      if (success) {
        console.log('✅ Showing success popup');
        this.popup.open({
          success: true,
          message: "Product has been sold to the consumer."
        });
      }
      else {
        alert('Transaction failed. Please try again.');
      }
    } catch (error: any) {
      if (error.message) {
        this.popup.open({
          success: false,
          message: error.message || "Something went wrong"
        });
      } else {
        alert("Transaction failed. Check console.");
      }
    }
  }

  startCameraScan(): void {
    this.cameraRunning = true;
    this.qrScanned = false;
    // wait for Angular to render the #qr-reader div
    setTimeout(() => {
      const qrRegionId = 'qr-reader';

      // clean old instance safely
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

  stopCamera(qrScanned : boolean = false): void {
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    this.handleFile(input.files[0]);
  }

  async handleFile(file: File): Promise<void> {
    this.previewImage = URL.createObjectURL(file);

    const qrContainerId = 'qr-reader';

    // Ensure DOM element exists before scanning
    let qrContainer = document.getElementById(qrContainerId);
    if (!qrContainer) {
      qrContainer = document.createElement('div');
      qrContainer.id = qrContainerId;
      qrContainer.style.display = 'none';
      document.body.appendChild(qrContainer);
    }

    try {
      const html5QrCode = new Html5Qrcode(qrContainerId);
      const decodedText = await html5QrCode.scanFile(file, true);
      console.log('✅ QR decoded from image:', decodedText);
      this.productSN = decodedText;
      // this.qrScanned = true;
      this.cdr.detectChanges();
      await html5QrCode.clear();
    } catch (error) {
      console.error('❌ Unable to read QR from image:', error);
      // this.productSN = 'Unable to read QR from image.';
    }
  }

  enableUploadMode(): void {
    this.uploadMode = true;
    this.qrScanned = false;
  }

  cancelUploadMode(): void {
    this.uploadMode = false;
    this.uploading = false;
    this.previewImage = null;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.uploading = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.uploading = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.uploading = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  clearPreview(): void {
    if (this.previewImage) URL.revokeObjectURL(this.previewImage);
    this.previewImage = null;
    this.uploadMode = false;
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
