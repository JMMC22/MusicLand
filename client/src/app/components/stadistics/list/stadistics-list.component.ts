import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { PublicationService } from 'src/app/services/publication.service';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/global';
import { FollowService } from 'src/app/services/follow.service';

@Component({
  selector: 'app-stadistics-list',
  templateUrl: './stadistics-list.component.html',
  providers: [UserService, PublicationService, FollowService]
})
export class StadisticsListComponent implements OnInit {

  public user: User;
  public status;
  public identity;
  public token;
  public stats;
  public url;
  public data;
  public follows;

  constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService, private _followService: FollowService,
    private _publicationService: PublicationService) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    this.loadData()
  }

  loadData() {
    if (this._router.url == ('/stadistics-list')) {
      this.follows = false;

      this._publicationService.getPublicationsPerUser(this.token).subscribe(response => {
        if (response.output) {
          this.status = "success"
          this.data = response.output;
          console.log(this.data)
        } else {
          this.status = "error"
        }
      }, error => {
        console.log(error)
      })
    } else if (this._router.url == ('/stadistics-list-follows')) {
      this.follows = true;

      this._followService.getUsersFolloweds(this.token).subscribe(res => {
        console.log(res)
        if (res.value.output) {
          this.status = "success"
          this.data = res.value.output;

        } else {
          this.status = "error"
        }
      }, error => {
        console.log(error)
      })
    }

  }
}
