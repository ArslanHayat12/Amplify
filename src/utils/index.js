
export const getOrgMentorURL = (url,orgKey,values) => {
    const params=values.join("")
    const key = orgKey ? `business.keyword` : `practitioner.keyword`
    const match_phrase=values.map(value=>`(match_phrase:(${key}:'${value}'))`).join(",")

    return url && `${url.url + url.dashboardId}?embed=true&_g=(filters:!((meta:(alias:!n,disabled:!f,index:'90bf3f10-5e50-11ec-b275-070a29d78d3f',key:${key},negate:!f,params:!(${params}),type:phrases),query:(bool:(minimum_should_match:1,should:!(${match_phrase})))))%2CrefreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3Anow-4y%2Cto%3Anow))&show-time-filter=true&hide-filter-bar=true`
}

export const getEmbededURL = (url, user, isAdmin, isBusiness, value) => {
    const practitionerId = value || user.attributes['custom:practitionerId']
    const businessId = value || user.attributes['custom:businessId']

    const filter = isAdmin ? '' : isBusiness ? `business.keyword:${businessId}` : `practitioner.keyword:${practitionerId}`

    const key = isAdmin ? '' : isBusiness ? `business.keyword` : `practitioner.keyword`
    return generatedUrl(url, filter, key, isAdmin)

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



export const generatedUrl = (url, filter, key, isAdmin) => {

    if (isAdmin) {
        return url && `${url.url + url.dashboardId}?embed=true&_g=(filters%3A!()%2CrefreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3Anow-15d%2Cto%3Anow))`
    }
    return url && `${url.url + url.dashboardId}?embed=true&_g=(filters:!((meta:(index:'90bf3f10-5e50-11ec-b275-070a29d78d3f',key:${key},negate:!f,type:phrase),
query:(match_phrase:(${filter}))))%2CrefreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3Anow-4y%2Cto%3Anow))&show-time-filter=true&hide-filter-bar=true`

}