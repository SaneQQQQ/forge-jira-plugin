import {Octokit} from 'octokit';
import {getSecret} from './kvsClient';
import {GITHUB_API_VERSION, GITHUB_API_TOKEN_KEY} from '../common/constants';
import {resolveRepoVisibility} from "../service/repoVisibilityService";

let octokitCache = null;
let tokenCache = null;

const initOctokit = async (tokenOverride) => {
    try {
        const token = tokenOverride ?? await getSecret(GITHUB_API_TOKEN_KEY);

        if (octokitCache && tokenCache === token) {
            return octokitCache;
        }

        octokitCache = new Octokit({
            auth: token,
            request: {
                headers: {'X-GitHub-Api-Version': GITHUB_API_VERSION},
            },
        });

        tokenCache = token;
        return octokitCache;
    } catch (err) {
        const message = `Failed to initialize GitHub API client: ${error.message}`;
        console.error(message);
        throw new Error(message);
    }
};

const withGithubClient = async (requestFn, errorMessage, tokenOverride) => {
    try {
        const octokit = await initOctokit(tokenOverride);
        return await requestFn(octokit);
    } catch (err) {
        const message = `${errorMessage}: ${err.message}`;
        console.error(message);
        throw new Error(message);
    }
};

export const getAllRepos = async (tokenOverride) => {
    const visibility = await resolveRepoVisibility();
    return withGithubClient(
        (octokit) => octokit.request('GET /user/repos', {visibility}),
        'Error fetching repositories',
        tokenOverride
    );
};

export const getAllRepoPullRequests = async (repoOwner, repoName) => {
    return await withGithubClient(
        (octokit) => octokit.request('GET /repos/{owner}/{repo}/pulls', {
            owner: repoOwner,
            repo: repoName,
            state: 'all',
        }),
        `Error fetching pull requests for ${repoOwner}/${repoName} repository`
    );
};

export const getAllPullRequestReviews = async (id, repoOwner, repoName) => {
    return await withGithubClient(
        (octokit) => octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews', {
            owner: repoOwner,
            repo: repoName,
            pull_number: id,
        }),
        `Error fetching reviews for pull request #${id} in ${repoOwner}/${repoName}`
    );
};

export const mergePullRequest = async (id, repoOwner, repoName) => {
    return await withGithubClient(
        (octokit) => octokit.request('PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge', {
            owner: repoOwner,
            repo: repoName,
            pull_number: id,
        }),
        `Error merging pull request #${id} in ${repoOwner}/${repoName}`
    );
};

export const approvePullRequest = async (id, repoOwner, repoName) => {
    return await withGithubClient(
        (octokit) => octokit.request('POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews', {
            owner: repoOwner,
            repo: repoName,
            pull_number: id,
            event: 'APPROVE',
        }),
        `Error approving pull request #${id} in ${repoOwner}/${repoName}`
    );
};