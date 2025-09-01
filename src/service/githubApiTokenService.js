import {getAllRepos} from '../client/githubApiClient';
import {deleteSecret, getSecret, setSecret} from '../client/kvsSecretsClient';
import {GITHUB_API_TOKEN_KEY} from '../common/constants';

export const validateToken = async ({payload}) => {
    try {
        const response = await getAllRepos(payload.token);
        return response.status === 200;
    } catch (err) {
        console.error(`GitHub token validation failed: ${err.message}`);
        return false;
    }
};

export const isTokenSet = async () => {
    try {
        return !! (await getSecret(GITHUB_API_TOKEN_KEY));
    } catch (err) {
        return false;
    }
};

export const saveToken = async ({payload}) =>
    await setSecret(GITHUB_API_TOKEN_KEY, payload.token).catch((err) => {
        const message = `Failed to save GitHub token: ${err.message}`;
        console.error(message);
        throw new Error(message);
    });

export const loadToken = async () =>
    await getSecret(GITHUB_API_TOKEN_KEY).catch((err) => {
        const message = `Failed to load GitHub token: ${err.message}`;
        console.error(message);
        throw new Error(message);
    });

export const removeToken = async () =>
    await deleteSecret(GITHUB_API_TOKEN_KEY).catch((err) => {
        const message = `Failed to delete GitHub token: ${err.message}`;
        console.error(message);
        throw new Error(message);
    });