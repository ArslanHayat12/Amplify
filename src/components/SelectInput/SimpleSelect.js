import React, { Fragment } from 'react'
import { Select } from 'antd'

import { SelectInputStyle } from './style'

const { Option } = Select

export const SimpleSelect = (props) => {
    const { options, width, disabled,mode,onChange,placeholder } = props

    return (
        <Fragment>
            <SelectInputStyle
                width={width}
                mode={mode}
                onChange={onChange}
                tokenSeparators={[',']}
                disabled={disabled}
                placeholder={placeholder}
            >
                {options.map(option => (
                    <Option key={option.key} value={option.key}>
                        {option.value}
                    </Option>
                ))}
            </SelectInputStyle>
        </Fragment>
    )
}