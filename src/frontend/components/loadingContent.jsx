import React from 'react';
import {Inline, Spinner} from "@forge/react";

const LoadingContent = ({ isLoading }) => {
    if (!isLoading) {
        return null;
    }

    return (
        <Inline alignInline="center">
            <Spinner size="xlarge"></Spinner>
        </Inline>
    )
}

export default LoadingContent;