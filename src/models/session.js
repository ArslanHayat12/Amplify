import { AreaChartOutlined } from '@ant-design/icons'


export const initialSession = {
    redirectPath: '/admin',
    role: 'admin'
}

export const getRoleBasedRoutes = (role) => {
    const isPractioner = role.includes("Practioner")
    const isBusiness = role.includes("Business")
    const isAdmin = role.includes("Admin")
    const isOrganization = role.includes("Organization")

    return {
        routes: [
            isAdmin && { name: 'Admin', path: '/admin', icon: <AreaChartOutlined /> },
            (isAdmin||isPractioner) && { name: 'Practioner', path: '/practioner', icon: <AreaChartOutlined /> },
            (isAdmin||isBusiness) && { name: 'Business', path: '/business', icon: <AreaChartOutlined /> },
            (isAdmin||isOrganization) && { name: 'Organization', path: '/organization', icon: <AreaChartOutlined /> },
        ].filter(Boolean),
        redirectPath: isAdmin ? '/admin' : isPractioner ? '/practioner' : isBusiness ? '/business' : '/organization'
    }
}
