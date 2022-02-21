import { AreaChartOutlined } from '@ant-design/icons'


export const initialSession = {
    redirectPath: '/admin',
    role: 'admin'
}

export const getRoleBasedRoutes = (role) => {
    const isPractitioner = role.includes("Practitioner")
    const isBusiness = role.includes("Business")
    const isAdmin = role.includes("Admin")
    // const isOrganizations = role.includes("Organizations")
    const isDashboard = role.includes("Dashboard")

    return {
        routes: [
            isAdmin && { name: 'Admin', path: '/admin', icon: <AreaChartOutlined /> },
            (isAdmin || isDashboard) && { name: 'Dashboard', path: '/dashboard', icon: <AreaChartOutlined /> },
            (isAdmin || isPractitioner) && { name: 'Practitioner', path: '/practitioner', icon: <AreaChartOutlined /> },
            (isAdmin || isBusiness) && { name: 'Business', path: '/business', icon: <AreaChartOutlined /> },
            // (isAdmin || isOrganizations) && { name: 'Organizations', path: '/organizations', icon: <AreaChartOutlined /> }
        ].filter(Boolean),
        redirectPath: isAdmin ? '/admin' : isPractitioner ? '/practitioner' : isBusiness ? '/business' : isDashboard ? '/dashboard' : '/organizations'
    }
}
