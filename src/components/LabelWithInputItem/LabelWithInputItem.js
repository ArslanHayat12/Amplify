import React from 'react'
import { LabelWithInputItemStyle } from './style'


export const LabelWithInputItem = (props) => {
    const { label, children, type = 'vertical' } = props

    return (
        <LabelWithInputItemStyle type={type}>
            <span className="input-item-label">{label}</span>
            {children}
        </LabelWithInputItemStyle>
    )
}