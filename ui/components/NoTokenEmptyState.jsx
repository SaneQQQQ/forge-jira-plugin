import React from "react";
import {EmptyState, LinkButton, useProductContext, useTranslation} from "@forge/react";

const NoTokenEmptyState = ({isTokenSet}) => {
    const {t} = useTranslation();
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
            header={t('ui.noTokenEmptyState.header')}
            description={t('ui.noTokenEmptyState.description')}
            primaryAction={<LinkButton href={`${context?.siteUrl}/jira/settings/apps/${parseLocalId(context?.localId)}`}
                                       appearance="primary">{t('ui.button.settings')}</LinkButton>}
            width="narrow"
        />
    );
}

export default NoTokenEmptyState;