import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { FollowService } from 'src/app/services/follow.service';
import { Follow } from 'src/app/models/follow';
import { PublicationService } from 'src/app/services/publication.service';
import { Publication } from 'src/app/models/publication';
import { GLOBAL } from 'src/app/services/global';
import { UploadService } from 'src/app/services/upload.service';
import { Song } from 'src/app/models/song';
import { Track } from 'src/app/models/track';
import { TrackService } from 'src/app/services/track.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  providers: [FollowService, PublicationService, UploadService, TrackService]
})
export class ProfileComponent implements OnInit {

  public user: User;
  public status;
  public identity;
  public token;
  public stats;
  public following;
  public followed;
  public url;
  public publications: Publication[];
  public total;
  public page;
  public pages;
  public track;
  public followUserOver;
  public id;

  constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService,
    private _followService: FollowService, private _publicationService: PublicationService, private _uploadService: UploadService, private sanitizer: DomSanitizer) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.following = false;
    this.followed = false;
    this.page = 1;
    this.url = GLOBAL.url;
    this.track = new Track("", "", "", "", this.identity);

  }

  ngOnInit() {
    this.loadPage();
  }



  loadPage() {
    this._route.params.subscribe(params => {
      let id = params['id'];
      this.id = id;
      this.getUser(id);
      this.getCounters(id);
      this.getPublications(id, this.page);
    })
  }

  getUser(id) {
    this._userService.getUser(id).subscribe(
      response => {
        if (response.user) {
          this.user = response.user;
          if (response.following && response.following._id) {
            this.following = true;
          } else {
            this.following = false;
          }
          if (response.followed && response.followed._id) {
            this.followed = true;
          } else {
            this.followed = false;
          }
        } else {
          this.status = "error";
        }
      }, error => {
        console.log(error)
        this._router.navigate(['/home']);
      })
  }

  getCounters(id) {
    this._userService.getCounters(id).subscribe(
      response => {
        if (response) {
          this.stats = response;
        } else {
          this.status = "error";
        }
      }, error => {
        console.log(error)

      })
  }

  follow(followed) {
    var follow = new Follow("", this.identity._id, followed);

    this._followService.follow(this.token, follow).subscribe(
      response => {
        if (!response.follow) {
          this.status = 'error';
        } else {
          this.following = true;
          this.getCounters(this.user._id)
        }
      }, error => {
        console.log(error);
        this.status = 'error';
      })
  }
  unfollow(followed) {
    this._followService.unFollow(this.token, followed).subscribe(
      response => {
        this.following = false
        this.getCounters(this.user._id)
      }, error => {
        console.log(error);
        this.status = 'error';
      })
  }

  getPublications(user, page, adding = false) {
    this._publicationService.getPublicationsUser(this.token, user, page).subscribe(
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

  onSubmit(form) {
    this._uploadService.makeFileRequest(this.url + 'upload-track/' + this.track.titulo, [], this.filesToUpload, this.token, 'track')
      .then((result: any) => {
        form.reset()
        this.status = "sent"
        $("html, body").animate({ scrollTop: 0 }, 600);

      }).catch((err) => {
        this.status = "error-sent";
      })

  }
  public filesToUpload: Array<File>;
  fileChangeEvent(fileInput: any) {

    this.filesToUpload = <Array<File>>fileInput.target.files;

    if (!(/([/|.|\w|\s|-])*\.(mp3)/.test(this.filesToUpload[0].name))) {
      this.status = "errorRegex"
    } else {
      this.status = "";
    }


  }

  mouseEnter(user_id) {
    this.followUserOver = user_id;
  }
  mouseLeave(user_id) {
    this.followUserOver = 0;
  }

  getSantizeUrl(url: string) {
    let spoURL = 'https://open.spotify.com/embed/track/' + url;
    return this.sanitizer.bypassSecurityTrustResourceUrl(spoURL);
  }


  public noMore = false;
  viewMore() {
    this.page += 1;

    if (this.page == this.pages) {
      this.noMore = true;
    }

    this.getPublications(this.id, this.page, true);
  }

  pause() {
    let audioPlayer = <HTMLVideoElement>document.getElementById("reproductor");
    audioPlayer.pause();
  }
}
