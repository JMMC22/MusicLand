import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersComponent } from './users.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let service: UserService;
  let router: Router;
  let elemDefault;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, FormsModule],
      declarations: [UsersComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({ page: 1 }) } }, {
          provide: UserService,
          useValue: {
            getUsers: () => ({})
          }
        }]

    })
      .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(UserService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('ngOnInit', () => {

    component.ngOnInit();
    fixture.detectChanges();

    console.log(component)

  });


});
