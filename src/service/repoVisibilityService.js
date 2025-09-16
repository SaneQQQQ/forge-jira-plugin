import {getProperty, setProperty} from "../client/kvsClient";
import {GITHUB_FETCH_PRIVATE_REPOS_KEY} from "../common/constants";

export const getPrivateRepoVisibility = async () => {
    return await getProperty(GITHUB_FETCH_PRIVATE_REPOS_KEY);
};

export const setPrivateRepoVisibility = async ({payload}) => {
    return await setProperty(GITHUB_FETCH_PRIVATE_REPOS_KEY, payload?.privateRepoVisibility);
};

export const resolveRepoVisibility = async () => {
    return (await getPrivateRepoVisibility()) ? 'all' : 'public';
};