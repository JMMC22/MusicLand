import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  providers: [UserService]
})
export class RegisterComponent implements OnInit {

  public user: User;
  public status: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ) {
    this.user = new User("", "", "", "", "ROLE_USER", "");
  }

  ngOnInit() {
  }

  onSubmit(form) {
    this._userService.register(this.user).subscribe(
      response => {
        if (response.user && response.user._id) {
          this.status = "success";
          form.reset();
        } else {
          if (response.message == "El usuario ya está registrado.") {
            this.status = "registrado"
          } else {
            this.status = "error"
          }
        }
      }, error => {
        console.log(error);
      }

    );
  }
}
