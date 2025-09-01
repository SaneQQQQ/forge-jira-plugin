import Resolver from '@forge/resolver';
import {isTokenSet, loadToken, removeToken, saveToken, validateToken} from '../service/githubApiTokenService';
import {
    approveGitHubPr,
    getAllGitHubPRsForRepoByIssueKey,
    getAllGitHubRepos,
    mergeGitHubPr
} from '../service/issueContextService';

const resolver = new Resolver();

resolver.define('validateToken', validateToken);
resolver.define('isTokenSet', isTokenSet);
resolver.define('saveToken', saveToken);
resolver.define('loadToken', loadToken);
resolver.define('removeToken', removeToken);

resolver.define('getAllGitHubRepos', getAllGitHubRepos);
resolver.define('getAllGitHubPRsForRepoByIssueKey', getAllGitHubPRsForRepoByIssueKey);
resolver.define('mergeGitHubPr', mergeGitHubPr);
resolver.define('approveGitHubPr', approveGitHubPr);

export const resolvers = resolver.getDefinitions();