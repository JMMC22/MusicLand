import { TestBed, async } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { FollowService } from 'src/app/services/follow.service';
import { UserService } from 'src/app/services/user.service';

describe('FollowService', () => {
  let service: FollowService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [FollowService,UserService]
    });
    service = TestBed.inject(FollowService);
  }));

  it('should be created', async(() => {
    expect(service).toBeTruthy();
  }));
});
