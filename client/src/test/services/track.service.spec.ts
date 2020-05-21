import { TestBed, async } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { MessageService } from 'src/app/services/message.service';
import { Message } from 'src/app/models/message';
import { TrackService } from 'src/app/services/track.service';

describe('TrackService', () => {
    let service: TrackService;
    let elemDefault;
    let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1ZWFlOTY4MDFhMzY1ODQ4MWMxZWE4ODkiLCJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBlbWFpbC5jb20iLCJyb2xlIjoiUk9MRV9BRE1JTiIsImF2YXRhciI6InVzZXIucG5nIiwiaWF0IjoxNTg4NTAwNjM4LCJleHAiOjE1OTEwOTI2Mzh9.lKVicnGInSnbG10Au_pJpMrWoI2rIDhKSW9TwIRkmSc';
    let user;
    let id;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [TrackService, UserService]
        });
        service = TestBed.inject(TrackService);

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



    it('getMyTracks', async(() => {
        service.getMyTracks(token, 1).subscribe(
            (response) => {
                expect(response).not.toBeNull();
            },
            (error) => fail(error)

        );

    }));

    it('getTracks', async(() => {
        service.getTracks(token, 1).subscribe(
            (response) => {
                expect(response).not.toBeNull();
            },
            (error) => fail(error)

        );

    }));




});