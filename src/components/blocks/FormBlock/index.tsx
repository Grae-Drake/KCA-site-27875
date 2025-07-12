import * as React from 'react';
import classNames from 'classnames';

import { getComponent } from '../../components-registry';
import { mapStylesToClassNames as mapStyles } from '../../../utils/map-styles-to-class-names';
import SubmitButtonFormControl from './SubmitButtonFormControl';

export default function FormBlock(props) {
    const { fields = [], elementId, submitButton, className, styles = {}, 'data-sb-field-path': fieldPath } = props;

    if (fields.length === 0) {
        return null;
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        console.log('=== FORM SUBMISSION DEBUG ===');
        
        const formData = new FormData(e.currentTarget);
        console.log('All form data:');
        for (let [key, value] of formData.entries()) {
            console.log(`  ${key}: "${value}"`);
        }
        
        // Check if all required fields are present
        const requiredFields = ['form-name', 'name', 'email'];
        const missingFields = requiredFields.filter(field => !formData.has(field));
        if (missingFields.length > 0) {
            console.error('Missing required fields:', missingFields);
        }
        
        console.log('Form target:', e.currentTarget.action);
        console.log('Form method:', e.currentTarget.method);
        console.log('Form name:', e.currentTarget.name);
        
        // Don't prevent default - let Netlify handle it
    };

    return (
        <form
            className={classNames(
                'sb-component',
                'sb-component-block',
                'sb-component-form-block',
                className,
                styles?.self?.margin ? mapStyles({ margin: styles?.self?.margin }) : undefined,
                styles?.self?.padding ? mapStyles({ padding: styles?.self?.padding }) : undefined,
                styles?.self?.borderWidth && styles?.self?.borderWidth !== 0 && styles?.self?.borderStyle !== 'none'
                    ? mapStyles({
                          borderWidth: styles?.self?.borderWidth,
                          borderStyle: styles?.self?.borderStyle,
                          borderColor: styles?.self?.borderColor ?? 'border-primary'
                      })
                    : undefined,
                styles?.self?.borderRadius ? mapStyles({ borderRadius: styles?.self?.borderRadius }) : undefined
            )}
            name="contact-form"
            method="POST"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
            data-sb-field-path={fieldPath}
        >
            {/* Debug info visible on page */}
            <div style={{ 
                background: '#f0f0f0', 
                padding: '10px', 
                margin: '10px 0', 
                fontSize: '12px',
                border: '1px solid #ccc'
            }}>
                <strong>DEBUG INFO (remove after fixing):</strong><br/>
                Form name: contact-form<br/>
                Method: POST<br/>
                Netlify attributes: data-netlify="true"<br/>
                Fields to render: {fields.length}
            </div>

            {/* Critical hidden fields */}
            <input type="hidden" name="form-name" value="contact-form" />
            
            {/* Honeypot for spam protection */}
            <div style={{ display: 'none' }}>
                <label>
                    Don't fill this out if you're human: <input name="bot-field" tabIndex={-1} autoComplete="off" />
                </label>
            </div>
            
            {/* Form fields */}
            <div
                className={classNames('w-full', 'flex', 'flex-wrap', 'gap-8', mapStyles({ justifyContent: styles?.self?.justifyContent ?? 'flex-start' }))}
                {...(fieldPath && { 'data-sb-field-path': '.fields' })}
            >
                {fields.map((field, index) => {
                    const modelName = field.__metadata.modelName;
                    if (!modelName) {
                        throw new Error(`form field does not have the 'modelName' property`);
                    }
                    const FormControl = getComponent(modelName);
                    if (!FormControl) {
                        throw new Error(`no component matching the form field model name: ${modelName}`);
                    }
                    return <FormControl key={index} {...field} {...(fieldPath && { 'data-sb-field-path': `.${index}` })} />;
                })}
            </div>
            
            {/* Submit button */}
            {submitButton && (
                <div className={classNames('mt-8', 'flex', mapStyles({ justifyContent: styles?.self?.justifyContent ?? 'flex-start' }))}>
                    <SubmitButtonFormControl {...submitButton} {...(fieldPath && { 'data-sb-field-path': '.submitButton' })} />
                </div>
            )}
        </form>
    );
}
