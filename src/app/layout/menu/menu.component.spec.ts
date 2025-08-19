import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMenu } from './menu.component';

describe('AppMenu', () => {
  let component: AppMenu;
  let fixture: ComponentFixture<AppMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
