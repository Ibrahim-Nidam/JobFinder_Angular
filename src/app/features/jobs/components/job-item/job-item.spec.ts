import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobItem } from './job-item';

describe('JobItem', () => {
  let component: JobItem;
  let fixture: ComponentFixture<JobItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
