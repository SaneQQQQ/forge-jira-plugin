import React from 'react';
import {Inline, Spinner, Box} from '@forge/react';

const LoadingSpinner = ({isLoading}) => {
    if (!isLoading) {
        return null;
    }

    return (
        <Box>
            <Inline alignInline="center">
                <Spinner size="xlarge" label="Loading content..." />
            </Inline>
        </Box>
    )
}

export default LoadingSpinner;