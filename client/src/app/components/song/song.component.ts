import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { GLOBAL } from 'src/app/services/global';
import { Song } from 'src/app/models/song';
import { SongService } from 'src/app/services/song.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Publication } from 'src/app/models/publication';
import { PublicationService } from 'src/app/services/publication.service';
import { SafePipe } from 'src/app/services/safe.pipe';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  providers: [PublicationService, SafePipe]
})
export class SongComponent implements OnInit {

  public identity;
  public token;
  public stats;
  public url;
  public status;
  public songs: Song[];
  public page;
  public total;
  public pages;
  public next_page;
  public prev_page;
  public query;
  public publication;
  public searchBoolean;

  constructor(private _userService: UserService, private _songService: SongService, private _route: ActivatedRoute, private _router: Router, private _publicationService: PublicationService, private sanitizer: DomSanitizer) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.stats = this._userService.getStats();
    this.url = GLOBAL.url;
    this.publication = new Publication("", "", "", "", this.identity, "");
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
      let par = params['query'];

      if (par) {
        this.query = par;
      }


      if (this.query) {
        this.search(page, this.query)
      } else {
        this.getSongs(page)
      }

    });
  }

  getSongs(page) {
    this._songService.getSongs(this.token, page).subscribe(response => {
      if (!response.songs) {
        this.status = 'error';
      } else {
        this.total = response.total;
        this.songs = response.songs;
        this.pages = response.pages;
        if (page > this.pages) {
          this._router.navigate(['/songs/1']);
        }
      }
    }, error => {
      console.log(error);
      this.status = 'error';
    })
  }

  refresh() {
    this.getSongs(1);
  }

  delete(id) {
    this._songService.delete(this.token, id).subscribe(
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
      this._songService.search(this.token, query, page).subscribe(
        response => {
          if (response.songs) {
            this.status = 'success';
            this.songs = response.songs;
            this.total = response.total;
            this.pages = response.pages;
            if (page > this.pages && page != 0 && this.pages != 0) {
              this._router.navigate(['/songs/1']);
            }

          } else {
            this.status = 'error';

          }
        }, error => {
          console.log(error)
        })
    }
  }
  searchs(query) {
    this._router.navigate(['/songs/' + query + '/1']);


  }


  onSubmit(form, songId) {
    this.status = "";
    this.publication.song = songId;
    this._publicationService.create(this.token, this.publication).subscribe(
      response => {
        if (response.publication) {
          this.status = "success-publication";
          form.reset();
          $("html, body").animate({ scrollTop: 0 }, 600);


        } else {
          this.status = "error-publication"
        }
      }, error => {
        console.log(error);
      }
    )
  }

  getSantizeUrl(url: string) {
    let spoURL = 'https://open.spotify.com/embed/track/' + url.substr(14);
    return this.sanitizer.bypassSecurityTrustResourceUrl(spoURL);
  }

  pause() {
    let audioPlayer = <HTMLVideoElement>document.getElementById("reproductor");
    audioPlayer.pause();
  }


}
