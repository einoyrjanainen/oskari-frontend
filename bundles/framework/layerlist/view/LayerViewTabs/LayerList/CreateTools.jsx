import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown } from 'oskari-ui';
import { PlusOutlined } from '@ant-design/icons';
const getToolTitle = tool => tool.getTitle() || tool.getTooltip() || tool.getName();

export const CreateTools = ({ tools }) => {
    if (!Array.isArray(tools) || tools.length === 0) {
        return null;
    }
    const items = tools.map(tool => ({ title: getToolTitle(tool), action: tool.getCallback() }));
    return (
        <Dropdown placement="bottomRight" items={items} click={false}>
            <Button><PlusOutlined /></Button>
        </Dropdown>
    );
};
CreateTools.propTypes = {
    tools: PropTypes.array.isRequired
};
