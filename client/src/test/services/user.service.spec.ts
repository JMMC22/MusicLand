import { TestBed, async } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

describe('UserService', () => {
  let elemDefault: User;
  let service: UserService;
  let admin: User;

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
    service.login(elemDefault,true).subscribe(
      (response) => {
        expect(response).not.toBeNull();
        localStorage.setItem('token', JSON.stringify(response));

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

  it('correct register', async(() => {
    const service: UserService = TestBed.get(UserService);

    const newUser: User = new User("", "testing", "testing", "testing@prueba.com", "", "");

    service.register(newUser).subscribe(
      (response) => expect(response).not.toBeNull(),
      (error) => fail(error)

    );
  }));

  it('getIdentity', async(() => {
    const service: UserService = TestBed.get(UserService);
    const identity = service.getIdentity();
    expect(identity).not.toBeNull();

  }));

  it('getToken', async(() => {
    const service: UserService = TestBed.get(UserService);
    const token = service.getToken();
    expect(token).not.toBeNull();

  }));
});
