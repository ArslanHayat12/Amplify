import { AreaChartOutlined } from '@ant-design/icons'


export const initialSession = {
    redirectPath: '/admin',
    role: 'admin'
}

export const getRoleBasedRoutes = (role) => {
    const isPractitioner = role.includes("Practitioner")
    const isBusiness = role.includes("Business")
    const isAdmin = role.includes("Admin")
    const isOrganizations = role.includes("Organizations")
    const isMentor = role.includes("Mentor")
    const isDashboard = role.includes("Dashboard")

    return {
        routes: [
            isAdmin && { name: 'Admin', path: '/admin', icon: <AreaChartOutlined /> },
            isAdmin && { name: 'Payroll Sync', path: '/sync', icon: <AreaChartOutlined /> },
            (isAdmin || isDashboard) && { name: 'Dashboard', path: '/dashboard', icon: <AreaChartOutlined /> },
            (isAdmin || isPractitioner) && { name: 'Practitioner', path: '/practitioner', icon: <AreaChartOutlined /> },
            (isAdmin || isBusiness) && { name: 'Business', path: '/business', icon: <AreaChartOutlined /> },
            (isAdmin || isOrganizations) && { name: 'Organizations', path: '/organizations', icon: <AreaChartOutlined /> },
            (isAdmin || isMentor) && { name: 'Mentors', path: '/mentors', icon: <AreaChartOutlined /> }
        ].filter(Boolean),
        redirectPath: isAdmin ? '/admin' : isPractitioner ? '/practitioner' : isBusiness ? '/business' : isDashboard ? '/dashboard' : isMentor ? '/mentors' :isOrganizations? '/organizations':'/sync'
    }
}
