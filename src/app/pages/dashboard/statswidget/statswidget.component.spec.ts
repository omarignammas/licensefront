import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatswidgetComponent } from './statswidget.component';

describe('StatswidgetComponent', () => {
  let component: StatswidgetComponent;
  let fixture: ComponentFixture<StatswidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatswidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatswidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
