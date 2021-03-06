import { Component, OnInit, Inject } from '@angular/core';
import { Publication } from '../../models/publication';
import { UserService } from 'src/app/services/user.service';
import { PublicationService } from 'src/app/services/publication.service';
import { Router } from '@angular/router';
import { SongService } from 'src/app/services/song.service';
import { Song } from 'src/app/models/song';
import { GLOBAL } from 'src/app/services/global';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from 'src/app/models/user';
import { DOCUMENT } from '@angular/common';
import { MessageService } from 'src/app/services/message.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  providers: [PublicationService, UserService, SongService]
})
export class TimelineComponent implements OnInit {

  public publication: Publication;
  public identity;
  public token;
  public stats;
  public status;
  public publications: Publication[];
  public topPublications: Publication[];
  public page;
  public total;
  public pages;
  public songs: Song[];
  public unvieweds;
  public url;
  public users: User[];
  public best: User[];
  public message100;
  public notify;



  constructor(@Inject(DOCUMENT) private document: Document, private _userService: UserService, private _messageSErvice: MessageService, private _publicationService: PublicationService, private _router: Router, private _songService: SongService, private sanitizer: DomSanitizer) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.stats = this._userService.getStats();
    this.publication = new Publication("", "", "", "", this.identity, "");
    this.page = 1;
    this.url = GLOBAL.url;

  }

  ngOnInit() {
    this.getPublications(this.page);
    this.getSongs();
    this.getTop();
    this.getRecommendedUsers();
    this.getCounters(this.identity._id);
    this.getBestUser();

  }


  onSubmit(form) {
    this._publicationService.create(this.token, this.publication).subscribe(response => {

      if (response.publication) {
        //this.publication = response.publication;
        this.status = 'success';
        form.reset();

        //Actualiza publicaciones al crear una
        this.getPublications(this.page);
      } else {
        this.status = 'error';
      }
    }, error => {
      console.log(error)
      this.status = 'error';
    })
  }

  getPublications(page, adding = false) {
    this._publicationService.getPublicationsTimeline(this.token, page).subscribe(
      response => {
        if (response.publications) {
          this.total = response.total;
          this.pages = response.pages;

          if (!adding) {
            this.publications = response.publications;

          } else {
            var pubA = this.publications;
            var pubB = response.publications;

            this.publications = pubA.concat(pubB);

            $("html,body").animate({ scrollTop: $('body').prop("scrollHeight") }, 500);
          }

        } else {
          this.status = 'error';
        }
      }, error => {
        console.log(error)
        this.status = 'error';
      })
  }
  getCounters(id) {
    this._userService.getCounters(id).subscribe(
      response => {
        if (response) {
          this.stats = response;
          this._messageSErvice.getMessagesUnviewedAndNotify(this.token).subscribe((response) => {
            if (response.unnotify == 0) {
              if (this.stats.followed == '100') {
                this._messageSErvice.message100(this.token).subscribe((response) => {
                  Swal.fire({
                    title: '¡Enhorabuena!',
                    text: '¡Has conseguido 100 seguidores, has pasado a la versión premium de la aplicación!',
                    imageUrl: '../../../assets/seleccion-de-la-guitarra.png',
                    imageWidth: 200,
                    imageHeight: 150,
                    imageAlt: 'Custom image',

                  })
                })
              }
            }
          })

        } else {
          this.status = "error";
        }
      }, error => {
        console.log(error)

      })
  }

  public noMore = false;
  viewMore() {
    this.page += 1;

    if (this.page == this.pages) {
      this.noMore = true;
    }

    this.getPublications(this.page, true);
  }

  getSongs() {
    this._songService.getAllSongs(this.token).subscribe(response => {
      this.songs = response.songs;
    }, error => {
      console.log(error);
    })
  }

  getTop() {
    this._publicationService.getTop3PublicationsSongs(this.token).subscribe(response => {
      if (response.songs) {
        this.topPublications = response.songs;
      }
    }, error => {
      console.log(error)
    })
  }

  getSantizeUrl(url: string) {
    let spoURL = 'https://open.spotify.com/embed/track/' + url.substr(14);
    return this.sanitizer.bypassSecurityTrustResourceUrl(spoURL);
  }

  getRecommendedUsers() {
    this._userService.getUsersRecommended().subscribe(
      response => {
        if (response.users) {
          this.users = response.users;
          this.status = 'success';

        } else {
          this.status = 'error';

        }
      }, error => {
        console.log(error)
      })
  }

  deletePublication(id) {
    this._publicationService.delete(this.token, id).subscribe(
      response => {
        this.refresh();
      }, error => {
        console.log(error)
      }
    )
  }

  refresh() {
    this.getPublications(1);
  }

  pause() {
    let audioPlayer = <HTMLVideoElement>document.getElementById("reproductor");
    audioPlayer.pause();
  }

  public first;
  public second;
  public third;

  getBestUser() {
    this._publicationService.getBestUser(this.token).subscribe(response => {
      if (response.usersRes) {
        if (response.usersRes.length != 0) {
          this._userService.getUser(response.usersRes[0]).subscribe(response => this.first = response.user)
          this._userService.getUser(response.usersRes[1]).subscribe(response => this.second = response.user)
          this._userService.getUser(response.usersRes[2]).subscribe(response => this.third = response.user)
        }

      }

    }, error => {
      console.log(error)
    })
  }


}
