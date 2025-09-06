import {approvePr, getAllPrs, getAllRepos, getAllReviews, mergePr} from '../client/githubApiClient';

export const getAllGitHubRepos = async () => {
    try {
        return await getAllRepos()
            .then(res => res.data.map(({id, name, private: isPrivate ,owner, html_url, language}) => ({
                    id,
                    name,
                    isPrivate,
                    url: html_url,
                    language: language ?? 'Unknown',
                    owner: owner.login}))
        );
    } catch (err) {
        const errorMessage = `Failed to fetch GitHub repositories: ${err.message}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const getAllGitHubPRsForRepoByIssueKey = async ({payload}) => {
    const issueKey = payload.issueKey;
    const repoOwner = payload.repository.owner;
    const repoName = payload.repository.name;

    try {
        const response = await getAllPrs(repoOwner, repoName);
        const prs = response.data.map(({number, title, html_url, state, user, head, merged_at}) => ({
                    id: number,
                    title,
                    url: html_url,
                    state,
                    merged: merged_at !== null,
                    user: {
                        login: user.login,
                        url: user.html_url,
                        avatarUrl: user.avatar_url
                    },
                    repository: {
                        name: repoName,
                        owner: repoOwner,
                    },
                    branchName: head.ref,
                    branchUrl: `https://github.com/${repoOwner}/${repoName}/tree/${head.ref}`}))
                .filter(pr => pr.branchName.includes(issueKey) || pr.title.includes(issueKey));

        return await Promise.all(
            prs.map(async (pr) => {
                const reviewState = await getLatestReviewState(
                    pr.id,
                    pr.repository.owner,
                    pr.repository.name
                );

                return {
                    ...pr,
                    state: normalizePrState(pr.merged, pr.state, reviewState),
                };
            }));
    } catch (err) {
        const errorMessage = `Failed to fetch pull requests for ${repoOwner}/${repoName} repository: ${err.message}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const mergeGitHubPr = async ({payload}) => {
    const id = payload.id;
    const repoOwner = payload.repository.owner;
    const repoName = payload.repository.name;

    try {
        const response = await mergePr(id, repoOwner, repoName)
        return response.status === 200 && response.data.merged === true;
    } catch (err) {
        const errorMessage = `Error merging PR with #id - ${id}: ${err.message}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
}

export const approveGitHubPr = async ({payload}) => {
    const id = payload.id;
    const repoOwner = payload.repository.owner;
    const repoName = payload.repository.name;

    try {
        const response = await approvePr(id, repoOwner, repoName);
        return response.status === 200 && response.data.state === 'APPROVED';
    } catch (err) {
        const errorMessage = `Error approving PR with #id - ${id}: ${err.message}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
}

const getLatestReviewState = async (id, repoOwner, repoName) => {
    try {
        return await getAllReviews(id, repoOwner, repoName)
            .then(res => res.data?.filter(review =>
                review.user.login.toLowerCase() === repoOwner.toLowerCase()).sort((a, b) =>
                new Date(b.submitted_at) - new Date(a.submitted_at))[0]?.state || null);
    } catch (err) {
        const errorMessage = `Error while checking if pull request with #id - ${id} approved by user: ${err.message}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
}

const normalizePrState = (merged, prState, reviewState) => {
    if (prState === 'closed') return 'closed';
    if (reviewState === 'APPROVED') return 'approved';
    return 'open';
};