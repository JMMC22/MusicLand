import { Component, OnInit, DoCheck } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { FollowService } from 'src/app/services/follow.service';
import { Follow } from 'src/app/models/follow';
import { GLOBAL } from 'src/app/services/global';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  providers: [UserService, FollowService]
})
export class UsersComponent implements OnInit {

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
  public followUserOver;
  public usernameSearch;

  constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService, private _followService: FollowService) {
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
      //Devolver usuarios
      let par = params['usernameSearch'];

      if (par) {
        this.usernameSearch = par;
      }


      if (this.usernameSearch) {
        this.search(page, this.usernameSearch)
      } else {
        this.getUsers(page)
      }

    });
  }

  getUsers(page) {
    this._userService.getUsers(page).subscribe(response => {
      if (!response.users) {
        this.status = 'error';
      } else {
        console.log(response)
        this.total = response.total;
        this.users = response.users;
        this.pages = response.pages;
        this.follows = response.users_following;
        if (page > this.pages) {
          this._router.navigate(['/buscar-gente/1']);
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

  search(page, usernameSearch) {
    if (usernameSearch == undefined || usernameSearch == '') {
      this.actualPage();
    } else {
      this._userService.getByUsername(usernameSearch, page).subscribe(
        response => {
          if (response.users) {
            this.status = 'success';
            this.users = response.users;
            this.total = response.total;
            this.pages = response.pages;
            this.follows = response.users_following;
        

            if (page > this.pages && page != 0 && this.pages != 0) {
              this._router.navigate(['/buscar-gente/1']);
            }

          } else {
            this.status = 'error';

          }
        }, error => {
          console.log(error)
        })
    }
  }
  searchs(usernameSearch) {
    this._router.navigate(['/buscar-gente/' + usernameSearch + '/1']);


  }

  refresh() {
    this.getUsers(1);
  }

  delete(user) {
    this._userService.delete(this.token, user._id).subscribe(response => {
      this.refresh();
    }, error => {
      console.log(error);
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

}
