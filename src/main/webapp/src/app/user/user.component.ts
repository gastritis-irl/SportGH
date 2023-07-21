import {Component, OnInit} from '@angular/core';
import {UserService} from './user.service';
import {User} from './user.model';

@Component({
  selector: 'app-root',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  users: [User];

  constructor(private userService: UserService) {
    this.users = [{}];
  }

  ngOnInit(): void {
    this.getUsersFromServer();
  }

  getUsersFromServer(): void {

    this.userService.getUsers().subscribe(
      {
        next: (response) => {
          this.users = response;
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        },
      }
    );
  }

  logUsers(): void {
    console.log(this.users);
  }
}
