import React, {useEffect, useState} from 'react';
import LoadingSpinner from "../components/LoadingSpinner";
import RepoExpand from "../components/RepoExpand";
import {invoke} from '@forge/bridge';
import ForgeReconciler, {Stack} from '@forge/react'
import NoTokenEmptyState from "../components/NoTokenEmptyState";

const IssueContext = () => {
    const [repositories, setRepositories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isTokenSet, setIsTokenSet] = useState(true);

    const getRepositories = async () => {
        return await invoke('getAllGitHubRepos');
    };

    const isTokenConfigured = async () => {
        return !! (await invoke('isTokenSet'));
    }

    const fetchRepositories = async () => {
        if (await isTokenConfigured()) {
            getRepositories()
                .then(setRepositories)
                .then(() => setIsLoading(false))
                .then(() => setIsTokenSet(true));
        } else {
            setIsTokenSet(false);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchRepositories();
    }, []);

    return (
        <>
            <LoadingSpinner isLoading={isLoading}>
                <Stack space="space.100">
                    {repositories && repositories.map(repository => (
                        <RepoExpand repository={repository}></RepoExpand>
                    ))}
                </Stack>
            </LoadingSpinner>
            <NoTokenEmptyState isTokenSet={isTokenSet}/>
        </>
    );
};

ForgeReconciler.render(
    <React.StrictMode>
        <IssueContext />
    </React.StrictMode>
);



