import React from 'react';
import {invoke} from '@forge/bridge';
import TruncatedLink from './TruncatedLink';
import PrStateLozenge from './PrStateLozenge';
import {Box, Button, DynamicTable, Stack, Text, useTranslation} from '@forge/react';

const DynamicPrsTable = ({pullRequests, setPullRequests}) => {
    const {t} = useTranslation();

    if (!pullRequests || pullRequests.length === 0) {
        return (
            <Box paddingBlockStart='space.150' paddingBlockEnd='space.100'>
                <Text align='center'>
                    {t('ui.pullRequestTable.emptyState')}
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
            {key: 'pullRequest', content: t('ui.pullRequestTable.head.pullRequest'), isSortable: true},
            {key: 'branch', content: t('ui.pullRequestTable.head.branch'), isSortable: true},
            {key: 'state', content: t('ui.pullRequestTable.head.state'), isSortable: true},
            {key: 'actions', content: t('ui.pullRequestTable.head.actions')},
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
                            {t('ui.button.approve')}
                        </Button>
                        <Button shouldFitContainer appearance='primary' spacing='compact'
                                onClick={() => onMerge(pr)}
                                isDisabled={pr.state === 'closed' || pr.merged}>
                            {t('ui.button.merge')}
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
                emptyView={t('ui.pullRequestTable.emptyState')}/>
        </Box>
    );
};

export default DynamicPrsTable;