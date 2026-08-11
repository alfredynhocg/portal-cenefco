import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerInstitutionsComponent } from './partner-institutions.component';

describe('PartnerInstitutionsComponent', () => {
  let component: PartnerInstitutionsComponent;
  let fixture: ComponentFixture<PartnerInstitutionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerInstitutionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnerInstitutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
