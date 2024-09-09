export interface FileUploadProgress {
  file: File;
  progress: number;
  fieldId: string;
  message: string;
  error?: string;
}

export interface FieldWithFiles {
  fieldId: string;
  files: File[];
}
