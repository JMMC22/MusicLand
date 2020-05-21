import { TestBed, async } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

describe('UserService', () => {
  let elemDefault: User;
  let service: UserService;
  let admin: User;
  let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1ZWFlOTY4MDFhMzY1ODQ4MWMxZWE4ODkiLCJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBlbWFpbC5jb20iLCJyb2xlIjoiUk9MRV9BRE1JTiIsImF2YXRhciI6InVzZXIucG5nIiwiaWF0IjoxNTg4NTAwNjM4LCJleHAiOjE1OTEwOTI2Mzh9.lKVicnGInSnbG10Au_pJpMrWoI2rIDhKSW9TwIRkmSc';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [UserService]
    });

    elemDefault = new User("", 'admin', 'admin', 'admin@email.com', "", "");

    const service: UserService = TestBed.get(UserService);

    service.login(elemDefault).subscribe(
      (response) => {
        expect(response).not.toBeNull();
        localStorage.setItem('identity', JSON.stringify(response));

      },
      (error) => { fail(error) }
    );


  }));

  /*it('should be created', async(() => {
    expect(service).toBeTruthy();
  }));*/

  /*it('correct login', async(() => {
    const service: UserService = TestBed.get(UserService);
 
    service.login(elemDefault, true).subscribe(
      (response) => expect(response).not.toBeNull(),
      (error) => fail(error)
 
    );
  }));*/

  let id;
  it('correct register', async(() => {

    const newUser: User = new User("", "testing", "testing", "testing@prueba.com", "ROLE_USER", "https://www.imagen.com.mx/assets/img/imagen_share.png");

    service.register(newUser).subscribe(
      (response) => {
        expect(response).not.toBeNull();
        id = response.user._id;
      },
      (error) => fail(error)

    );
  }));

  it('getIdentity', async(() => {
    const identity = service.getIdentity();
    expect(identity).not.toBeNull();

  }));

  it('getToken', async(() => {
    const token = service.getToken();
    expect(token).not.toBeNull();

  }));

  it('deleteUser', async(() => {
    service.delete(token, id).subscribe(
      (response) => { expect(response).not.toBeNull() },
      (error) => fail(error)

    );

  }));
});
