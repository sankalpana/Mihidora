import React from 'react';

const renderNode = (node) => {
    if (!node) {
        return null;
    }

    switch (node.type) {
        case 'paragraph':
            return (
                <p key={node.version}>
                    {node.children.map((child) => renderNode(child))}
                </p>
            );
        case 'text':
            return <span key={node.version}>{node.text}</span>;
        case 'link': // Added case for handling hyperlinks
            return (
                <a key={node.version} href={node.url} rel={node.rel} target={node.target}>
                    {node.children.map((child) => renderNode(child))}
                </a>
            );
        case 'autolink': // Added case for handling hyperlinks
            return (
                <a key={node.version} href={node.url} rel={node.rel} target={node.target}>
                    {node.children.map((child) => renderNode(child))}
                </a>
            );
        case 'list':
            if (node.listType === 'number') {
                return (
                    <ol key={node.version}>
                        {node.children.map((child) => (
                            <li key={child.version}>{renderNode(child)}</li>
                        ))}
                    </ol>
                );
            } else {
                return (
                    <ul key={node.version}>
                        {node.children.map((child) => (
                            <li key={child.version}>{renderNode(child)}</li>
                        ))}
                    </ul>
                );
            }
        case 'listitem':
            return (
                <span key={node.version}>
                    {node.children.map((child) => renderNode(child))}
                </span>
            );
        // Add more cases for other node types as needed

        default:
            return null;
    }
};

const RenderHTML = (props) => {
    // console.log(JSON.parse(props.data));
    const root = JSON.parse(props.data);
    if (!props.data || !root.root) {
        return null;
    }


    console.log(root.root);
    return (
        <div>
            {root.root.children.map((child) => renderNode(child))}
        </div>
        // <div>This is a test</div>
    );
};

export default RenderHTML;
