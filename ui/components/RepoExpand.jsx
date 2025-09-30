import React, {useState} from 'react';
import {invoke} from '@forge/bridge';
import DynamicPrsTable from './DynamicPrsTable'
import {Box, Button, Inline, Lozenge, Strong, useProductContext} from '@forge/react';

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
            backgroundColor: 'elevation.surface.raised',
            boxShadow: 'elevation.shadow.raised',
            borderRadius: 'border.radius',
            padding: 'space.100'
        }}>
            <Button
                isSelected={isOpen}
                appearance='subtle'
                iconBefore={repository.isPrivate ? 'lock-locked' : 'lock-unlocked'}
                shouldFitContainer
                onClick={() => onClick()}
            >
                <Inline spread='space-between'>
                    <Strong>{repository.name}</Strong>
                    <Box>
                        <Lozenge appearance='success' isBold>
                            {repository.language}
                        </Lozenge>
                    </Box>
                </Inline>
            </Button>
            {isOpen && (
                <DynamicPrsTable pullRequests={pullRequests} setPullRequests={setPullRequests}></DynamicPrsTable>
            )}
        </Box>
    );
};

export default RepoExpand;