import React from 'react';
import {invoke} from '@forge/bridge';
import TruncatedLink from './TruncatedLink';
import PrStateLozenge from './PrStateLozenge';
import {Box, Button, DynamicTable, Stack, Text} from '@forge/react';

const DynamicPrsTable = ({pullRequests, setPullRequests}) => {
    if (!pullRequests || pullRequests.length === 0) {
        return (
            <Box paddingBlockStart='space.150' paddingBlockEnd='space.100'>
                <Text align='center'>
                    No pull requests found
                </Text>
            </Box>
        );
    }

    const onApprove = async (pr) => {
        const success = await invoke('approveGitHubPr', {id: pr.id, repository: pr.repository});
        if (success) {
            setPullRequests(prev =>
                prev.map(p =>
                    p.id === pr.id ? {...p, state: 'approved'} : p
                )
            );
        }
    };

    const onMerge = async (pr) => {
        const success = await invoke('mergeGitHubPr', {id: pr.id, repository: pr.repository});
        if (success) {
            setPullRequests(prev =>
                prev.map(p =>
                    p.id === pr.id ? {...p, state: 'closed', merged: true} : p
                )
            );
        }
    };

    const head = {
        cells: [
            {key: 'pullRequest', content: 'Pull Request', isSortable: true},
            {key: 'branch', content: 'Branch', isSortable: true},
            {key: 'state', content: 'State', isSortable: true},
            {key: 'actions', content: 'Actions'},
        ],
    };

    const rows = pullRequests.map((pr, index) => ({
        key: `pr-${index}`,
        cells: [
            {
                key: `pullRequest-${index}`,
                content: <TruncatedLink name={pr.title} href={pr.url}/>
            },
            {
                key: `branch-${index}`,
                content: <TruncatedLink name={pr.branchName} href={pr.branchUrl}/>
            },
            {
                key: `state-${index}`,
                content: <PrStateLozenge state={pr.state}/>
            },
            {
                key: `actions-${index}`,
                content: (
                    <Stack space='space.100' alignBlock='center'>
                        <Button shouldFitContainer appearance='primary' spacing='compact'
                                onClick={() => onApprove(pr)}
                                isDisabled={pr.state === 'approved' || pr.state === 'closed' || pr.merged}>
                            Approve
                        </Button>
                        <Button shouldFitContainer appearance='primary' spacing='compact'
                                onClick={() => onMerge(pr)}
                                isDisabled={pr.state === 'closed' || pr.merged}>
                            Merge
                        </Button>
                    </Stack>
                ),
            },
        ],
    }));

    return (
        <Box xcss={{marginTop: 'space.100'}}>
            <DynamicTable
                head={head}
                rows={rows}
                rowsPerPage={5}
                emptyView='No pull requests found'/>
        </Box>
    );
};

export default DynamicPrsTable;