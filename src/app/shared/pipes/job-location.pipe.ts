import { Pipe, PipeTransform } from '@angular/core';
import { Job } from '../../core/models/job';

@Pipe({
  name: 'jobLocation',
  standalone: true
})
export class JobLocationPipe implements PipeTransform {
  transform(job: Job | null, defaultValue: string = 'Non specifie'): string {
    if (!job || !job.locations || job.locations.length === 0) {
      return defaultValue;
    }
    return job.locations[0].name || defaultValue;
  }
}
