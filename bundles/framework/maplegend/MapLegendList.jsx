import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Collapse, CollapsePanel } from 'oskari-ui';
import { LegendImage } from './LegendImage';
import { MetadataIcon } from 'oskari-ui/components/icons';

export const MapLegendList = ({ legendList }) => {
    const composeHeader = (title, uuid, metadataUrl) => {
        return (
            <Fragment>
                { title }
                <MetadataIcon metadataId={uuid} metadataUrl={metadataUrl || null} style={{ margin: '0 0 0 10px' }} />
            </Fragment>
        );
    };

    return (
        <Collapse>
            { legendList.length > 0 && legendList.map((item) => {
                return (
                    <CollapsePanel key={ item.title } header={ composeHeader(item.title, item.uuid, item.metadataUrl) }>
                        <LegendImage url={ item.legendImageURL } />
                    </CollapsePanel>
                );
            }) }
        </Collapse>
    );
};

MapLegendList.propTypes = {
    legendList: PropTypes.arrayOf(PropTypes.object)
};
