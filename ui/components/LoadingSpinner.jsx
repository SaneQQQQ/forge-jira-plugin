import React from 'react';
import {Inline, Spinner, Box, Stack, useTranslation} from '@forge/react';

const LoadingSpinner = ({children, isLoading, height = 100, size = 'large'}) => {
    const {t} = useTranslation();

    if (!isLoading) {
        return children;
    }

    return (
        <Inline alignBlock="stretch" alignInline='center'>
            <Stack alignBlock="center">
                <Box>
                    <Spinner size={size} label={t('ui.spinner.label')} />
                </Box>
            </Stack>
            <Box xcss={{height: `${height}px`}}/>
        </Inline>
    )
}

export default LoadingSpinner;