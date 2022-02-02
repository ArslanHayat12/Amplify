export const getEmbededURL = (url, user, isAdmin, isBusiness) => {

    const filter = isAdmin ? '' : isBusiness ? `business.keyword=${user.attributes['custom:businessId']}` : `practioner.keyword=${user.attributes['custom:practitionerId']}`

    return url && `${url.url + url.dashboardId}?embed=true&_g=(filters%3A!(${filter})%2CrefreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3Anow-2y%2Cto%3Anow))&hide-filter-bar=true`

}

export const getCustomRoleType = (customRole) => {
    const customRoleData = customRole?.split(',')
    let isPractitioner = false;
    let isBusiness = false;
    let isAdmin = true;
    if (customRoleData?.length) {
        isPractitioner = customRoleData.includes('Practitioner')
        isBusiness = customRoleData.includes('Business')
    }

    return { isBusiness, isPractitioner, isAdmin }
}