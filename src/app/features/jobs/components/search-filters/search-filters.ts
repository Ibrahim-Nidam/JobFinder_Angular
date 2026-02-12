import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

export interface SearchCriteria {
  keyword: string;
  location: string;
}

@Component({
  selector: 'app-search-filters',
  imports: [ReactiveFormsModule],
  templateUrl: './search-filters.html',
  styleUrl: './search-filters.css',
})
export class SearchFilters {
  @Input() isLoading: boolean = false;
  @Output() search = new EventEmitter<SearchCriteria>();

  searchForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      keyword: [''],
      location: ['']
    });
  }

  onSubmit(): void {
    const criteria: SearchCriteria = {
      keyword: this.searchForm.value.keyword || '',
      location: this.searchForm.value.location || ''
    };
    this.search.emit(criteria);
  }
}
