import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FormsService } from '../services/forms.service';
import { ActiveStepData, FormBuilderComponent } from '../shared/components/form-builder/form-builder.component';
import { FieldWithFiles } from '../shared/components/form-builder/models/file-upload.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormBuilderComponent, FormBuilderComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private formsService = inject(FormsService);

  activeStep = this.formsService.activeStep;
  formData = this.formsService.formdata;
  error = this.formsService.error;

  ngOnInit(): void {
    this.formsService.setFormId(1);
  }

  onChangeStep(activeStepData: ActiveStepData) {
    this.formsService.setStep(activeStepData.stepAlias);
  }

  onFilesDrop(fieldValue: FieldWithFiles) {
    console.info('fieldValue', fieldValue);
  }
}
