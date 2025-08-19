import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFloatingconfigurator } from './floatingconfigurator.component';

describe('AppFloatingconfigurator', () => {
  let component: AppFloatingconfigurator;
  let fixture: ComponentFixture<AppFloatingconfigurator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppFloatingconfigurator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppFloatingconfigurator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
