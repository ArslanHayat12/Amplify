import React, { Fragment } from 'react'
import { useField } from 'formik'
import { InputBoxStyle } from './style'

export const InputBox = (props) => {
    const [field, meta] = useField(props)
    const invalid = Boolean(meta.error && meta.touched)
    const { placeholder, width, suffix, rounded, disabled } = props

    return (
        <Fragment>
            <InputBoxStyle
                name={field.name}
                placeholder={placeholder}
                width={width}
                suffix={suffix}
                rounded={rounded}
                disabled={disabled}
                onBlur={field.onBlur}
                onChange={field.onChange}
                value={field.value}
                error={invalid ? invalid : undefined}
            />
            {invalid && <span className="error-message">{meta.error}</span>}
        </Fragment>
    )
}