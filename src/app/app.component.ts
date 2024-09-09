import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FormsService } from '../services/forms.service';
import { formData } from '../shared/components/form-builder/form-builder-content';
import { ActiveStepData, FormBuilderComponent } from '../shared/components/form-builder/form-builder.component';
import { FieldWithFiles } from '../shared/components/form-builder/models/file-upload.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormBuilderComponent, FormBuilderComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private formsService = inject(FormsService);

  activeStep = this.formsService.activeStep;
  formData = formData;

  onChangeStep(activeStepData: ActiveStepData) {
    this.formsService.updateForm(activeStepData);
  }

  onFilesDrop(fieldValue: FieldWithFiles) {
    console.info('fieldValue', fieldValue);
  }
}
