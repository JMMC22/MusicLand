import { Component, OnInit, DoCheck } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { FollowService } from 'src/app/services/follow.service';
import { Follow } from 'src/app/models/follow';
import { GLOBAL } from 'src/app/services/global';
import { Location } from '@angular/common';


@Component({
  selector: 'app-follows',
  templateUrl: './follows.component.html',
  providers: [UserService, FollowService]
})
export class FollowsComponent implements OnInit {

  public identity;
  public token;
  public page;
  public url;
  public next_page;
  public prev_page;
  public status;
  public total;
  public pages;
  public users: User[];
  public follows;
  public following;
  public followUserOver;
  public usernameSearch;
  public user_page;

  constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService, private _followService: FollowService, private _location: Location) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.usernameSearch = "";
  }

  ngOnInit() {
    this.actualPage();
  }

  actualPage() {
    this._route.params.subscribe(params => {

      let user_id = params['id'];
      this.user_page = user_id;

      let page = +params['page'];

      if (!params['page']) {
        page = 1;
      }

      this.page = page;

      if (!page) {
        page = 1;
      } else {
        this.next_page = page + 1;
        this.prev_page = page - 1;

        if (this.prev_page <= 0) {
          this.prev_page = 1;
        }
      }

      this.getUser(user_id, page)

    });
  }

  getFollows(user_id, page) {
    this._followService.getFollowing(this.token, user_id, page).subscribe(response => {
      if (!response.follows) {
        this.status = 'error';
      } else {
        this.total = response.total;
        this.following = response.follows;
        this.pages = response.pages;
        this.follows = response.users_following
        if (page > this.pages) {
          this._router.navigate(['/siguiendo/'+user_id+'/1']);
        }
      }
    }, error => {
      console.log(error);
      this.status = 'error';
    })
  }

  mouseEnter(user_id) {
    this.followUserOver = user_id;
  }
  mouseLeave(user_id) {
    this.followUserOver = 0;
  }

  follow(followed) {
    var follow = new Follow("", this.identity._id, followed);

    this._followService.follow(this.token, follow).subscribe(
      response => {
        if (!response.follow) {
          this.status = 'error';
        } else {
          this.status = "success";
          this.follows.push(followed);
          //this.getCounters();
        }
      }, error => {
        console.log(error);
        this.status = 'error';
      })
  }
  unfollow(followed) {
    this._followService.unFollow(this.token, followed).subscribe(
      response => {
        var user = this.follows.indexOf(followed);
        if (user != -1) {
          this.follows.splice(user, 1);
        }
        //this.getCounters();
      }, error => {
        console.log(error);
        this.status = 'error';
      })
  }


  getCounters() {
    this._userService.getCounters().subscribe(
      response => {
        this.status = 'success';
        localStorage.setItem('stats', JSON.stringify(response));
      }
      , error => {
        console.log(error);
      });
  }

  public user;
  getUser(id,page) {
    this._userService.getUser(id).subscribe(
      response => {
        if (response.user) {
          this.user = response.user;
          this.getFollows(id, page)

        } else {
          this._router.navigate(['/timeline']);
        }
      }, error => {
        console.log(error);
      })
  }

  atras(){
    this._location.back();
  }

}
