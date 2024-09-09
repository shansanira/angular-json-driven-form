import { FieldType, IForm } from './models/form.model';

export const formData: IForm = {
  title: 'User Registration',
  steps: [
    {
      id: 'step1',
      alias: 'personal_info',
      label: 'Personal Information',
      type: 'InternalStep',
      blocks: [
        {
          id: 'block1',
          alias: 'basic_details',
          label: 'Basic Details',
          type: 'FieldsBlock',
          fields: [
            {
              id: 'field1',
              name: 'first_name',
              label: 'First Name',
              value: '',
              fieldType: FieldType.TextField,
              textFieldType: 'text',
              htmlInputType: 'text',
              validators: {
                required: true,
                minLength: 2,
                maxLength: 50,
              },
            },
            {
              id: 'field2',
              name: 'last_name',
              label: 'Last Name',
              textFieldType: 'text',
              value: '',
              fieldType: FieldType.TextField,
              htmlInputType: 'text',
              validators: {},
            },
          ],
        },
        {
          id: 'block2',
          alias: 'contact_details',
          label: 'Contact Details',
          type: 'text',
          fields: [
            {
              id: 'field3',
              name: 'email',
              label: 'Email',
              textFieldType: 'email',
              value: '',
              fieldType: FieldType.TextField,
              htmlInputType: 'email',
              validators: {
                required: true,
                email: true,
              },
            },
            {
              id: 'field4',
              name: 'phone',
              label: 'Phone Number',
              textFieldType: 'text',
              value: '',
              fieldType: FieldType.TextField,
              htmlInputType: 'tel',
              validators: {},
              extras: {
                icon: 'phone-icon',
                min: '10',
                max: '15',
                step: '1',
              },
            },
          ],
        },
      ],
      isComplete: false,
    },
    {
      id: 'step2',
      alias: 'preferences',
      label: 'Preferences',
      type: 'InternalStep',
      blocks: [
        {
          id: 'block3',
          alias: 'communication_preferences',
          label: 'Communication Preferences',
          type: 'FieldsBlock',
          fields: [
            // {
            //   id: 'field5',
            //   name: 'subscribe_newsletter',
            //   label: 'Subscribe to Newsletter',
            //   value: 'yes',
            //   fieldType: FieldType.TextField,
            //   textFieldType: 'text',
            //   htmlInputType: 'checkbox',
            //   validators: {},
            // },
            {
              id: 'field5',
              name: 'upload_file',
              label: 'Upload File',
              value: null,
              fieldType: FieldType.UploadField,
              htmlInputType: 'file',
              validators: {},
            },
          ],
        },
        // {
        //   id: 'block4',
        //   alias: 'privacy_settings',
        //   label: 'Privacy Settings',
        //   type: 'radio',
        //   fields: [
        //     {
        //       id: 'field6',
        //       name: 'share_data',
        //       label: 'Share Data with Partners',
        //       textFieldType: 'text',
        //       value: 'no',
        //       fieldType: FieldType.TextField,
        //       htmlInputType: 'radio',
        //       validators: {},
        //     },
        //   ],
        // },
      ],
      isComplete: false,
    },
  ],
};
