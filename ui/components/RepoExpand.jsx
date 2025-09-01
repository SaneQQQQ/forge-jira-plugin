import React, {useState} from 'react';
import {invoke} from '@forge/bridge';
import {Box, Button, Inline, Lozenge, Strong, useProductContext} from '@forge/react';
import DynamicPRsTable from './DynamicPRsTable'

const RepoExpand = ({repository}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [pullRequests, setPullRequests] = useState([]);
    const context = useProductContext();

    const getAllPullRequests = async () => {
        const issueKey = context?.extension.issue.key;
        return await invoke('getAllGitHubPRsForRepoByIssueKey',
            {repository: repository, issueKey: issueKey});
    };

    const onClick = async () => {
        if(isOpen) {
            setIsOpen(!isOpen);
            return;
        }

        getAllPullRequests()
            .then(setPullRequests)
            .then(() => setIsOpen(!isOpen));
    };

    return (
        <Box xcss={{
            borderRadius: 'border.radius',
            borderStyle: 'solid',
            borderWidth: 'border.width',
            borderColor: 'color.border',
            padding: 'space.100'
        }}>
            <Button
                isSelected={isOpen}
                appearance="subtle"
                iconBefore={repository.isPrivate ? "lock-locked" : "lock-unlocked"}
                shouldFitContainer
                onClick={() => onClick()}
            >
                <Inline spread="space-between">
                    <Strong>{repository.name}</Strong>
                    {repository.language && (
                        <Lozenge appearance="success" isBold>
                            {repository.language}
                        </Lozenge>
                    )}
                    {!repository.language && (
                        <Lozenge appearance="moved" isBold>
                            unknown
                        </Lozenge>
                    )}
                </Inline>
            </Button>
            {isOpen && (
                <Box xcss={{marginTop: 'space.100'}}>
                    <DynamicPRsTable pullRequests={pullRequests} setPullRequests={setPullRequests}></DynamicPRsTable>
                </Box>
            )}
        </Box>
    );
};

export default RepoExpand;