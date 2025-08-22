import Resolver from '@forge/resolver';
import { Octokit } from "octokit";
import { kvs } from "@forge/kvs";

const resolver = new Resolver();

resolver.define('isValidToken', async (req) => {
    const octokit = new Octokit({
        auth: req.payload.token,
    });

    try {
        const response = await octokit.request('GET /user/repos', {
        headers: {
            'X-GitHub-Api-Version': '2022-11-28',
          },
        });

        return response.status === 200;
    } catch (err) {
        throw new Error('Token validation check failed');
    }
});

resolver.define('saveToken', async (req) => {
    const token = req.payload.token;
    if (!token) {
        throw new Error('Token is required');
    }

    await kvs.setSecret('token', token);
    return true;
});

resolver.define('getToken', async () => {
    const token = await kvs.getSecret('token');
    return token ? token : '';
});

resolver.define('deleteToken', async () => {
    await kvs.deleteSecret('token');
    return true;
})

export const handler = resolver.getDefinitions();