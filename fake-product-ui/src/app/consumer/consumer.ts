import {Component, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {Web3Service} from "../services/web3.service";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-consumer',
  imports: [
    RouterLink
  ],
  templateUrl: './consumer.html',
  styleUrl: './consumer.css',
})
export class ConsumerComponent implements OnInit{

  constructor(private web3: Web3Service) {}

  async ngOnInit() {
    await this.web3.loadContract();
  }
}
