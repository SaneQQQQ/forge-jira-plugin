import React from "react";
import {EmptyState, LinkButton, useProductContext} from "@forge/react";

const NoTokenEmptyState = ({isTokenSet}) => {
    const context = useProductContext();

    if (isTokenSet) {
        return null;
    }

    const parseLocalId = (ari) => {
        const match = ari.match(/extension\/([^/]+\/[^/]+)\/static\//);
        return match ? match[1] : '';
    }

    return (
        <EmptyState
            header="GitHub Token Required"
            description="You haven't set a GitHub Personal Access Token (PAT) yet. This token is required for the app to access your repositories."
            primaryAction={<LinkButton href={`${context?.siteUrl}/jira/settings/apps/${parseLocalId(context?.localId)}`}
                                       appearance="primary">Open App Settings</LinkButton>}
            width="narrow"
        />
    );
}

export default NoTokenEmptyState;