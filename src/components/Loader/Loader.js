import React from 'react'
import {  LoaderStyle } from './style'
import { Loader as AppLoader } from '@aws-amplify/ui-react'

export const Loader = () => {
    return (
        <LoaderStyle>
            <AppLoader />
        </LoaderStyle>
    )
}