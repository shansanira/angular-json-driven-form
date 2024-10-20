/** @type {import('tailwindcss').Config} */
import { join } from 'path';

const plugin = require('tailwindcss/plugin');

// prettier-ignore
module.exports = {
  content: [join(__dirname, 'src/**/!(*.spec).{ts,html}')],
  theme: {
    colors: {
      'transparent': 'transparent',
      'current': 'currentColor',

      'base-0': 'var(--sys-color-base-0, #fff)',
      'base-15': 'var(--sys-color-base-15, #f2f2f2)',
      'base-25': 'var(--sys-color-base-25, #ebebeb)',
      'base-35': 'var(--sys-color-base-35, #bebebe)',
      'base-50': 'var(--sys-color-base-50, #848484)',
      'base-75': 'var(--sys-color-base-75, #676767)',
      'base-85': 'var(--sys-color-base-85, #4a5568)',
      'base-100': 'var(--sys-color-base-100, #000)',

      'primary': 'var(--sys-color-primary)',
      'secondary': 'var(--sys-color-secondary)',
      'tertiary': 'var(--sys-color-tertiary)',
      'highlight': 'var(--sys-color-highlight)',

      'heading': 'var(--sys-color-text-heading, var(--sys-color-primary))',
      'sub-heading': 'var(--sys-color-text-subheading, var(--sys-color-primary))',
      'body': 'var(--sys-color-text-body, var(--sys-color-base-75))',
      'anchor': 'var(--sys-color-text-anchor, var(--sys-color-secondary))',
      'description': 'var(--sys-color-text-description, var(--sys-color-base-35))',

      'button': 'var(--sys-color-button-background, var(--sys-color-primary))',
      'button-hover': 'var(--sys-color-button-background-hover, var(--sys-color-secondary))',
      'button-text': 'var(--sys-color-button-text, var(--sys-color-secondary))',
      'button-text-hover': 'var(--sys-color-button-text-hover, var(--sys-color-primary))',

      'container': 'var(--sys-color-container-background, var(--sys-color-base-0))',
      'container-outline': 'var(--sys-color-container-border, transparent)',

      // used color-mix to calculate the color based on the alpha value (used in selection-button-group.component.html)
      'field': 'color-mix(in srgb, var(--sys-color-field-border, var(--sys-color-primary)) calc(100% * <alpha-value>), transparent)',
      'field-help': 'var(--sys-color-field-help-text, var(--sys-color-text-body))',
      'label': 'var(--sys-color-field-label, var(--sys-color-primary))',

      'error': 'var(--sys-color-error)',
      'error-subtle': 'var(--sys-color-error-subtle)',
      'error-light': 'var(--sys-color-error-light)',
      'error-dark': 'var(--sys-color-error-dark)',

      'success': 'var(--sys-color-success)',
      'success-subtle': 'var(--sys-color-success-subtle)',
      'success-light': 'var(--sys-color-success-light)',
      'success-dark': 'var(--sys-color-success-dark)',

      'warning': 'var(--sys-color-warning)',
      'warning-subtle': 'var(--sys-color-warning-subtle)',
      'warning-light': 'var(--sys-color-warning-light)',
      'warning-dark': 'var(--sys-color-warning-dark)',

      'info': 'var(--sys-color-info)',
      'info-subtle': 'var(--sys-color-info-subtle)',
      'info-light': 'var(--sys-color-info-light)',
      'info-dark': 'var(--sys-color-info-dark)',

      'progress': 'var(--sys-color-progress-bar, var(--sys-color-base-15))',
      'progress-handle': 'var(--sys-color-progress-bar-handle, var(--sys-color-primary))',
    },
    fontFamily: {
      'heading': 'var(--sys-font-family-heading)',
      'base': 'var(--sys-font-family-text)',
    },
    extend: {
      fontSize: {
        'h1': 'var(--sys-font-size-heading, 40px)',
        'h2': 'var(--sys-font-size-subheading1, 28px)',
        'h3': 'var(--sys-font-size-subheading2, 24px)',
        'h4': 'var(--sys-font-size-subheading3, 20px)',
        'base': 'var(--sys-font-size-text, 16)',
        'field-label': 'var(--sys-field-label-font-size, var(--sys-font-size-base))',
        'help-text': 'var(--sys-field-help-text-font-size, 14px)',
      },
      fontWeight: {
        'heading': 'var(--sys-font-weight-heading, 600)',
        'subheading': 'var(--sys-font-weight-subheading, 500)',
        'base': 'var(--sys-font-weight-text, 400)',
        'field-label': 'var(--sys-field-label-font-weight, 400)',
      },
      lineHeight: {
        'heading': 'var(--sys-line-height-heading, 1.3)',
        'subheading': 'var(--sys-line-height-subheading, 1.3)',
        'base': 'var(--sys-line-height-text, 1.5)',
      },
      borderRadius: {
        'field': 'var(--sys-field-border-radius, 0)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    plugin(function ({ addBase, config }) {
      addBase({
        h1: {
          fontSize: config('theme.fontSize.h1'),
          fontWeight: config('theme.fontWeight.heading'),
          lineHeight: config('theme.lineHeight.heading'),
        },
        h2: {
          fontSize: config('theme.fontSize.h2'),
          fontWeight: config('theme.fontWeight.subheading'),
          lineHeight: config('theme.lineHeight.subheading'),
        },
        h3: {
          fontSize: config('theme.fontSize.h3'),
          fontWeight: config('theme.fontWeight.subheading'),
          lineHeight: config('theme.lineHeight.subheading'),
        },
        h4: {
          fontSize: config('theme.fontSize.h4'),
          fontWeight: config('theme.fontWeight.subheading'),
          lineHeight: config('theme.lineHeight.subheading'),
        },
        p: {
          fontSize: config('theme.fontSize.base'),
          fontWeight: config('theme.fontWeight.base'),
          lineHeight: config('theme.lineHeight.base'),
        },
        progress: {
          verticalAlign: 'text-top',
        },
        'progress::-webkit-progress-bar': {
          backgroundColor: config('theme.colors.progress'),
          borderRadius: config('theme.borderRadius.full'),
        },
        'progress::-webkit-progress-value': {
          backgroundColor: config('theme.colors.progress-handle'),
          borderRadius: config('theme.borderRadius.full'),
          transition : `all 500ms linear`,
        }
      });
    }),
  ],
}
