import Resolver from '@forge/resolver';
import {sendFeedback} from "../service/feedbackService";
import {isTokenSet, loadToken, removeToken, saveToken, validateToken} from '../service/githubApiTokenService';
import {approveGitHubPr, getAllGitHubPRsForRepoByIssueKey, getAllGitHubRepos, mergeGitHubPr} from '../service/issueContextService';
import {getPrivateRepoVisibility, setPrivateRepoVisibility} from "../service/repoVisibilityService";

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

resolver.define('getPrivateRepoVisibility', getPrivateRepoVisibility);
resolver.define('setPrivateRepoVisibility', setPrivateRepoVisibility);

resolver.define('sendFeedback', sendFeedback);

export const resolvers = resolver.getDefinitions();