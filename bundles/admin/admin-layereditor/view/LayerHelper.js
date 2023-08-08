export const GEOMETRY_TYPES = ['unknown', 'point', 'line', 'area', 'collection'];
const AREA_TYPES = ['surface', 'polygon'];

export const getGeometryType = layer => {
    const { attributes, capabilities } = layer;
    if (attributes?.data?.geometryType) {
        return attributes.data.geometryType;
    }
    const { geomName, featureProperties = [] } = capabilities;
    const capaType = featureProperties.find(prop => prop.name === geomName)?.type.toLowerCase() || '';
    // SurfacePropertyType, GeometryPropertyType, PointPropertyType, MultiLineStringPropertyType, MultiPolygon,...
    if (AREA_TYPES.find(type => capaType.includes(type))) {
        return 'area';
    }
    return GEOMETRY_TYPES.find(type => capaType.includes(type)) || 'unknown';
};

// keys are the server side expected keys and values are the keys used by frontend
const APIMapping = {
    dataprovider_id: 'dataProviderId',
    group_ids: 'groups',
    gfi_content: 'gfiContent',
    gfi_type: 'gfiType',
    gfi_xslt: 'gfiXslt',
    capabilities_update_rate_sec: 'capabilitiesUpdateRate'
};

export const getLayerHelper = () => {
    /**
     * Returns an object for admin functionality where data has been collected from server response
     * @param {Object} layer from server response
     * @param {Object} options
     */
    const fromServer = (layer, options = {}) => {
        const transformed = {
            groups: [],
            attributes: {},
            options: {},
            ...layer
        };
        // map keys from server response to clients expected keys
        Object.keys(APIMapping).forEach(key => {
            if (!layer[key]) {
                // server response didn't have the key - nothing needs to be done
                return;
            }
            // map keys to ones expected by the frontend
            const frontendKey = APIMapping[key];
            transformed[frontendKey] = layer[key];
            // remove keys generated by the spread operation
            delete transformed[key];
        });
        initPermissionsForLayer(layer, options.roles);
        setupTemporaryFields(transformed);
        let removeKeys = ['capabilities'];
        if (Array.isArray(options.preserve)) {
            removeKeys = removeKeys.filter(key => !options.preserve.includes(key));
        }
        removeKeys.forEach(key => delete transformed[key]);

        // remove "unset" values like dataproviderId is always -1 for new layers
        Object.keys(transformed).forEach(key => {
            if (transformed[key] === -1) {
                delete transformed[key];
            }
        });
        // VectorStyle has numeric (long) id (oskari_maplayer_style)
        // Layer default style is stored in oskari_maplayer as string
        const { style, vectorStyles } = layer;
        if (vectorStyles && !isNaN(style)) {
            transformed.style = parseInt(style);
        }
        return transformed;
    };

    const toServer = layer => {
        const payload = {
            ...layer
        };
        Object.keys(APIMapping).forEach(key => {
            const frontendKey = APIMapping[key];
            // map keys to ones expected by the server
            payload[key] = layer[frontendKey];
            // remove keys generated by the spread operation
            delete payload[frontendKey];
        });
        removeTemporaryFields(payload);
        return payload;
    };

    const setupTemporaryFields = layer => {
        // Add temp json fields to keep the state on invalid json syntax
        layer.tempAttributesJSON = toJson(layer.attributes);
        layer.tempAttributionsJSON = toJson(layer.options.attributions);
        layer.tempHoverJSON = toJson(layer.options.hover);
        layer.tempTileGridJSON = toJson(layer.options.tileGrid);
        layer.isNew = !layer.id;
    };

    const removeTemporaryFields = layer => {
        delete layer.role_permissions.all;
        delete layer.tempAttributesJSON;
        delete layer.tempAttributionsJSON;
        delete layer.tempHoverJSON;
        delete layer.tempTileGridJSON;
        delete layer.isNew;
    };

    /**
     * @method getMVTStylesWithoutSrcLayer
     * Styles in MVT layer options contain data source layer names as filtering keys.
     * This function returns styles without the layer child.
     * Useful when there is only one known data source layer for the styles.
     * @return {Object} styles object without layer name filters for easier JSON editing.
     */
    // This is MVT layer specific function, MVT support is not implemented yet.
    // eslint-disable-next-line no-unused-vars
    const getMVTStylesWithoutSrcLayer = (styles) => {
        if (!styles) {
            return;
        }
        // deep clone styles
        var stylesCopy = JSON.parse(JSON.stringify(styles));
        // remove mvt src layer key
        Object.keys(stylesCopy).forEach(function (styleKey) {
            var style = stylesCopy[styleKey];
            Object.keys(style).forEach(function (layerKey) {
                var layer = style[layerKey];
                Object.keys(layer).forEach(function (styleDefKey) {
                    var styleDef = layer[styleDefKey];
                    style[styleDefKey] = styleDef;
                    delete style[layerKey];
                    stylesCopy[styleKey] = style;
                });
            });
        });
        return stylesCopy;
    };

    /**
     * @method getMVTStylesWithSrcLayer
     * Styles in MVT layer options contain data source layer names as filtering keys.
     * This function set styles with the layer child.
     * @return {Object} styles object with layer name filters for easier JSON editing.
     */
    // This is MVT layer specific function, MVT support is not implemented yet.
    // eslint-disable-next-line no-unused-vars
    const getMVTStylesWithSrcLayer = (styles, layerName) => {
        if (!styles) {
            return;
        }
        const styleJson = JSON.parse(styles);
        Object.keys(styleJson).forEach(function (styleKey) {
            var mvtSrcLayerStyleDef = {};
            mvtSrcLayerStyleDef[layerName] = styleJson[styleKey];
            styleJson[styleKey] = mvtSrcLayerStyleDef;
        });
        return styleJson;
    };

    /**
     * @method initPermissionsForLayer
     * @param {Object} layer data that will be enhanced with permissions data
     * @param {Object[]} roles array of objects with name key as roles available for the user to see
     */
    const initPermissionsForLayer = (layer = {}, roles = []) => {
        if (!layer.role_permissions) {
            layer.role_permissions = {};
        }
        roles.forEach(role => {
            if (!layer.role_permissions[role.name]) {
                layer.role_permissions[role.name] = [];
            }
        });
        return layer;
    };

    /**
     * Helper to stringify object
     */
    const toJson = obj => obj ? JSON.stringify(obj, null, 2) : '';

    const createEmpty = (roles = []) => {
        const layer = {
            opacity: 100,
            groups: [],
            capabilities: {},
            options: {},
            attributes: {}
        };
        initPermissionsForLayer(layer, roles);
        setupTemporaryFields(layer);
        return layer;
    };

    return {
        fromServer,
        toServer,
        createEmpty,
        toJson,
        initPermissionsForLayer
    };
};
