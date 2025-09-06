import {Octokit} from 'octokit';
import {getSecret} from './kvsSecretsClient';
import {GITHUB_API_VERSION, GITHUB_API_TOKEN_KEY} from '../common/constants';

export const prepareOctokit = async (token) => {
    try {
        const resolvedToken = token ?? await getSecret(GITHUB_API_TOKEN_KEY);
        return new Octokit({
            auth: resolvedToken,
            request: {
                headers: {'X-GitHub-Api-Version': GITHUB_API_VERSION},
            },
        });
    } catch (err) {
        const message = `Failed to prepare GitHub API client: ${err.message}`;
        console.error(message);
        throw new Error(message);
    }
};

const githubRequest = async (requestFn, errorMessage, token) => {
    try {
        const octokit = await prepareOctokit(token);
        return await requestFn(octokit);
    } catch (err) {
        const message = `${errorMessage}: ${err.message}`;
        console.error(message);
        throw new Error(message);
    }
};

export const getAllRepos = async (token) =>
    await githubRequest(
        async (octokit) => await octokit.request('GET /user/repos'),
        'Error fetching repositories',
        token
    );

export const getAllPrs = async (repoOwner, repoName) =>
    await githubRequest(
        async (octokit) => await octokit.request('GET /repos/{owner}/{repo}/pulls', {
            owner: repoOwner,
            repo: repoName,
            state: 'all',
        }),
        `Error fetching pull requests for ${repoOwner}/${repoName} repository`
    );

export const getAllReviews = async (id, repoOwner, repoName) =>
    await githubRequest(
        async (octokit) => await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews', {
            owner: repoOwner,
            repo: repoName,
            pull_number: id,
        }),
        `Error fetching reviews for pull request #${id} in ${repoOwner}/${repoName}`
    );

export const mergePr = async (id, repoOwner, repoName) =>
    await githubRequest(
        async (octokit) => await octokit.request('PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge', {
            owner: repoOwner,
            repo: repoName,
            pull_number: id,
        }),
        `Error merging pull request #${id} in ${repoOwner}/${repoName}`
    );

export const approvePr = async (id, repoOwner, repoName) =>
    await githubRequest(
        async (octokit) => await octokit.request('POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews', {
            owner: repoOwner,
            repo: repoName,
            pull_number: id,
            event: 'APPROVE',
        }),
        `Error approving pull request #${id} in ${repoOwner}/${repoName}`
    );