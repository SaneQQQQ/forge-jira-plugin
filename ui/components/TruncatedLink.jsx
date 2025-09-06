import React from 'react';
import {Link, Tooltip} from '@forge/react';

const truncateStr = (str, maxLength = 30) => {
    if (!str) {
        return '';
    }
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
};

const TruncatedLink = ({name, href, maxLength}) => {
    return (
        <Tooltip content={name}>
            <Link href={href} openNewTab>
                {truncateStr(name, maxLength)}
            </Link>
        </Tooltip>
    );
}

export default TruncatedLink;