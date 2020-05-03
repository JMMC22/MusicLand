import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Artist } from 'src/app/models/artist';
import { ArtistService } from 'src/app/services/artist.service';
import { GLOBAL } from 'src/app/services/global';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  providers: [ArtistService]
})
export class ArtistComponent implements OnInit {

  public identity;
  public token;
  public stats;
  public url;
  public status;
  public artists: Artist[];
  public page;
  public total;
  public pages;
  public next_page;
  public prev_page;
  public new;
  public query;

  constructor(private _userService: UserService, private _artistService: ArtistService, private _route: ActivatedRoute, private _router: Router) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.stats = this._userService.getStats();
    this.url = GLOBAL.url;
    this.query = "";

  }

  ngOnInit() {
    this.actualPage();
  }

  actualPage() {
    this._route.params.subscribe(params => {

      let page = +params['page'];

      if (!+params['page']) {
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
      //Devolver usuarios
      let par = params['query'];

      if (par) {
        this.query = par;
      }


      if (this.query) {
        this.search(page, this.query)
      } else {
        this.getArtists(page)
      }
    });
  }

  getArtists(page) {
    this._artistService.getArtists(this.token, page).subscribe(response => {
      if (!response.artists) {
        this.status = 'error';
      } else {
        console.log(response)
        this.total = response.total;
        this.artists = response.artists;
        this.pages = response.pages;
        if (page > this.pages) {
          this._router.navigate(['/artists/1']);
        }
      }
    }, error => {
      console.log(error);
      this.status = 'error';
    })
  }

  refresh() {
    this.getArtists(1);
  }

  delete(id) {
    this._artistService.delete(this.token, id).subscribe(
      response => {
        this.refresh();
      }, error => {
        console.log(error)
      })
  }

  search(page, query) {
    if (query == undefined || query == '') {
      this.actualPage();
    } else {
      this._artistService.search(this.token, query, page).subscribe(
        response => {
          if (response.artists) {
            this.status = 'success';
            this.artists = response.artists;
            this.total = response.total;
            this.pages = response.pages;
            if (page > this.pages && page != 0 && this.pages != 0) {
              this._router.navigate(['/artists/1']);
            }

          } else {
            this.status = 'error';

          }
        }, error => {
          console.log(error)
        })
    }
  }

}
