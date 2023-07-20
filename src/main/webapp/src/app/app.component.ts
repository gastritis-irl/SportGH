import {Component, OnInit} from '@angular/core';
import {ApiService} from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  data: any;

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.getDataFromServer();
  }

  getDataFromServer(): void {
    this.apiService.getData().subscribe(
      (response) => {
        this.data = response;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  logData(): any {
    console.log(this.data);
  }
}
