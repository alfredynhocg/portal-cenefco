import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestBulletinsComponent } from './latest-bulletins.component';

describe('LatestBulletinsComponent', () => {
  let component: LatestBulletinsComponent;
  let fixture: ComponentFixture<LatestBulletinsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LatestBulletinsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LatestBulletinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
