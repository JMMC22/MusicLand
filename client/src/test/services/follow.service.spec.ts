import { TestBed, async } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { FollowService } from 'src/app/services/follow.service';
import { UserService } from 'src/app/services/user.service';
import { Follow } from 'src/app/models/follow';
import { User } from 'src/app/models/user';

describe('FollowService', () => {
  let service: FollowService;
  let elemDefault;
  let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1ZWFlOTY4MDFhMzY1ODQ4MWMxZWE4ODkiLCJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBlbWFpbC5jb20iLCJyb2xlIjoiUk9MRV9BRE1JTiIsImF2YXRhciI6InVzZXIucG5nIiwiaWF0IjoxNTg4NTAwNjM4LCJleHAiOjE1OTEwOTI2Mzh9.lKVicnGInSnbG10Au_pJpMrWoI2rIDhKSW9TwIRkmSc';
  let user;
  let id;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [FollowService, UserService]
    });
    service = TestBed.inject(FollowService);

    elemDefault = new User("", 'user', 'user', 'user@email.com', "", "");

    const serviceUser: UserService = TestBed.get(UserService);

    serviceUser.login(elemDefault).subscribe(
      (response) => {
        expect(response).not.toBeNull();
        localStorage.setItem('identity', JSON.stringify(response));
        user = response.user;

      },
      (error) => { fail(error) }
    );
  }));

  it('follow', async(() => {

    const follow: Follow = new Follow("", "", user._id);


    service.follow(token, follow).subscribe(
      (response) => {
        expect(response).not.toBeNull();
        id = response.follow._id;
      },
      (error) => fail(error)

    );

  }));

  it('unfollow', async(() => {

    service.unFollow(token, user._id).subscribe(
      (response) => {
        expect(response).not.toBeNull()
      },
      (error) => fail(error)

    );

  }));

  it('getMyFollows', async(() => {

    service.getFollowing(token, user._id).subscribe(
      (response) => {
        expect(response).not.toBeNull()
      },
      (error) => fail(error)

    );

  }));
  it('getFollowed', async(() => {

    service.getFollowed(token, user._id).subscribe(
      (response) => {
        expect(response).not.toBeNull()
      },
      (error) => fail(error)

    );

  }));

  it('getMyFollowed', async(() => {

    service.getMyFolloweds(token).subscribe(
      (response) => {
        expect(response).not.toBeNull()
      },
      (error) => fail(error)

    );

  }));


});
