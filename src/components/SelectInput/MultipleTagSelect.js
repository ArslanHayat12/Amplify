import React, { Fragment } from 'react'
import { Select } from 'antd'
import { useField } from 'formik'

import { SelectInputStyle } from './style'

const { Option } = Select

export const MultipleTagSelect = (props) => {
    const [field, meta] = useField(props)
    const invalid = field['value'] && !field['value'].length && Boolean(meta.error && meta.touched)
    const { options, width, disabled, setFieldValue, setFieldTouched } = props

    function handleChange(value) {
        setFieldValue(field.name, value)
    }

    return (
        <Fragment>
            <SelectInputStyle
                name={field.name}
                value={field.value}
                width={width}
                mode="multiple"
                onBlur={() => setFieldTouched && setFieldTouched(field.name, true)}
                onChange={handleChange}
                tokenSeparators={[',']}
                disabled={disabled}
                error={invalid ? invalid : undefined}
            >
                {options.map(option => (
                    <Option key={option.key} value={option.key}>
                        {option.value}
                    </Option>
                ))}
            </SelectInputStyle>
            {invalid && <span className="error-message">{meta.error}</span>}
        </Fragment>
    )
}