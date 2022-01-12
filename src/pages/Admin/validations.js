import * as yup from 'yup'

export const REQUIRED = 'Required'

export const userFormValidation = () => {
    return yup.object().shape({
        name: yup.string().trim().required(REQUIRED),
        email: yup.string().trim().required(REQUIRED),
        role: yup
            .array()
            .of(yup.string())

            .required('Minimum one role')
    })
}

export const dashboardFormValidation = () => {
    return yup.object().shape({
        url: yup.string().trim().required(REQUIRED),
        dashboardId: yup.string().trim().required(REQUIRED),
        role:yup.string().trim().required(REQUIRED),
    })
}