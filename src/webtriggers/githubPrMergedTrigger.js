import api, {route} from '@forge/api';
import {JIRA_ISSUE_KEY_REGEX} from "../common/constants";

export const handleGithubPrMerged = async ({body}) => {
    const parsedBody = typeof body === "string" ? JSON.parse(body) : body;
    const {action, pull_request} = parsedBody;

    if (action === 'closed' && pull_request.state === 'closed') {
        let match = pull_request.title.match(JIRA_ISSUE_KEY_REGEX);
        if (!match) {
            match = pull_request.head.ref.match(JIRA_ISSUE_KEY_REGEX);
        }
        if (match) {
            try {
                if (await moveJiraIssueToDone(match[0])) {
                    return {
                        statusCode: 200,
                        headers: {},
                        body: `Issue: ${match} - were successfully moved to done state`,
                    };
                }
            } catch (err) {
                const errorMessage = `${err.message}`;
                console.log(errorMessage);
                throw new Error(errorMessage);
            }
        }
        console.log("No JIRA key found in PR title or branch name.");
    }
}

const moveJiraIssueToDone = async (issueKey) => {
    const response = await api
        .asApp()
        .requestJira(route`/rest/api/3/issue/${issueKey}/transitions`, {
            headers: {
                'Accept': 'application/json'
            }
    });
    const data = await response.json();
    const doneTransition = data?.transitions.find(t => t.name === 'Done');
    if (doneTransition) {
        const response = await api
            .asApp()
            .requestJira(route`/rest/api/3/issue/${issueKey}/transitions`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({transition: {id: doneTransition.id}})
        });
        if (response.status === 204) {
            return true;
        }
    }
    const errorMessage = `Error during transition ticket #${issueKey} to Done state`;
    console.log(errorMessage);
    throw new Error(errorMessage);
}