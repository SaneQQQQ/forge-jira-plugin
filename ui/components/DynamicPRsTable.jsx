import React from 'react';
import {DynamicTable, Text, Link, Lozenge, Button, Stack} from '@forge/react';
import {invoke} from "@forge/bridge";

const DynamicPRsTable = ({pullRequests, setPullRequests}) => {
    if (!pullRequests || pullRequests.length === 0) {
        return <Text align="center">No pull requests found</Text>;
    }

    const head = {
        cells: [
            { key: 'pullRequest', content: 'Pull Request', isSortable: true },
            { key: 'branch', content: 'Branch', isSortable: true },
            { key: 'state', content: 'State'}, // TODO: move state Lozenge logic to backend and make this field sortable
            { key: 'actions', content: 'Actions' },
        ],
    };

    const rows = pullRequests.map((pr, index) => ({
        key: `pr-${index}`,
        cells: [
            {
                key: `pullRequest-${index}`,
                content: (
                    <Link href={pr.url}>
                        {pr.title}
                    </Link>
                ),
            },
            {
                key: `branch-${index}`,
                content: (
                    <Link href={pr.branchUrl}>
                        {pr.branchName}
                    </Link>
                ),
            },
            {
                key: `state-${index}`,
                content: (
                    <Lozenge appearance={pr.state === 'open' && pr.reviewState !== 'APPROVED' ? 'inprogress'
                        : pr.state === 'open' && pr.reviewState === 'APPROVED' ? 'success'
                            : pr.state === 'closed' ? 'new' : 'default'}>
                        {pr.state === 'open' && pr.reviewState === 'APPROVED' ? pr.reviewState : pr.state}
                    </Lozenge>
                ),
            },
            {
                key: `actions-${index}`,
                content: (
                    <Stack space="space.100" alignBlock="center">
                        <Button shouldFitContainer appearance="primary" spacing="compact"
                                onClick={() => onApprove(pr)}
                                isDisabled={pr.reviewState === 'APPROVED' || pr.state === 'closed' || pr.merged}>
                            Approve
                        </Button>
                        <Button shouldFitContainer appearance="primary" spacing="compact"
                                onClick={() => onMerge(pr)}
                                isDisabled={pr.state === 'closed' || pr.merged}>
                            Merge
                        </Button>
                    </Stack>
                ),
            },
        ],
    }));

    const onApprove = async (pr) => {
        const success = await invoke('approveGitHubPr', {id: pr.id, repository: pr.repository});
        if (success) {
            setPullRequests(prev =>
                prev.map(p =>
                    p.id === pr.id ? { ...p, reviewState: 'APPROVED' } : p
                )
            );
        }
    };

    const onMerge = async (pr) => {
        const success = await invoke('mergeGitHubPr', {id: pr.id, repository: pr.repository});
        if (success) {
            setPullRequests(prev =>
                prev.map(p =>
                    p.id === pr.id ? { ...p, state: 'closed', merged: true } : p
                )
            );
        }
    };

    return (
        <DynamicTable
            head={head}
            rows={rows}
            rowsPerPage={5}
            emptyView="No pull requests found"
        />
    );
};

export default DynamicPRsTable;