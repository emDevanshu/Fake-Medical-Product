import { Component } from '@angular/core';
import {NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-consumer',
  imports: [
    NgIf,
    RouterLink
  ],
  templateUrl: './consumer.html',
  styleUrl: './consumer.css',
})
export class ConsumerComponent {

}
