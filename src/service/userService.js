import api, {route} from "@forge/api";

export const fetchCurrentUserDetails = async (context) => {
    const response = await api.asUser().requestJira(route`/rest/api/3/user?accountId=${context.accountId}`, {
        headers: {
            'Accept': 'application/json'
        }
    });
    const user = await response.json();
    return  {
        id: user.accountId,
        avatar: user.avatarUrls['48x48'],
        name: user.displayName,
        email: user.emailAddress,
    };
}