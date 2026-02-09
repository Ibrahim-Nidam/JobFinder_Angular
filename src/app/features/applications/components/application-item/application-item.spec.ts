import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationItem } from './application-item';

describe('ApplicationItem', () => {
  let component: ApplicationItem;
  let fixture: ComponentFixture<ApplicationItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
