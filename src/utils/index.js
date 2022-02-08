export const getEmbededURL = (url, user, isAdmin, isBusiness) => {
    const practitionerId = user.attributes['custom:practitionerId']
    const filter = isAdmin ? '' : isBusiness ? `business.keyword:${user.attributes['custom:businessId']}` : `practitioner.keyword:${practitionerId}`
    return generatedUrl(url, filter)

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

export const generatedUrl = (url, filter) => {

    return url && `${url.url + url.dashboardId}?embed=true&_g=(filters:!((meta:(index:'90bf3f10-5e50-11ec-b275-070a29d78d3f',key:practitioner.keyword,negate:!f,type:phrase),
query:(match_phrase:(${filter}))))%2CrefreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3Anow-4y%2Cto%3Anow))&show-time-filter=true&hide-filter-bar=true`

}