import { AreaChartOutlined } from '@ant-design/icons'


export const initialSession = {
    redirectPath: '/admin',
    role: 'admin'
}

export const roleBasedRoutes = {
    Practioner: {
        routes: [
            { name: 'Practioner', path: '/practioner', icon: <AreaChartOutlined /> },
        ],
        redirectPath: '/practioner'
    },
    "Practioner,Business": {
        routes: [
            { name: 'Practioner', path: '/practioner', icon: <AreaChartOutlined /> },
            { name: 'Business', path: '/business', icon: <AreaChartOutlined /> }
        ],
        redirectPath: '/practioner'
    },
    "Admin,Practioner,Business": {
        routes: [
            { name: 'Admin', path: '/admin', icon: <AreaChartOutlined /> },
            { name: 'Practioner', path: '/practioner', icon: <AreaChartOutlined /> },
            { name: 'Business', path: '/business', icon: <AreaChartOutlined /> }
        ],
        redirectPath: '/admin'
    },
    Business: {
        routes: [
            { name: 'Business', path: '/business', icon: <AreaChartOutlined /> }
        ],
        redirectPath: '/business'
    },
    Admin: {
        routes: [
            { name: 'Admin', path: '/admin', icon: <AreaChartOutlined /> },
            { name: 'Business', path: '/business', icon: <AreaChartOutlined /> },
            { name: 'Practioner', path: '/practioner', icon: <AreaChartOutlined /> },
        ],
        redirectPath: '/admin'
    }
}
