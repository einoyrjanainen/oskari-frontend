/**
 * @class Oskari.integration.bundle.todo.ToDoBundle
 *
 * This WILL Contain following items
 *
 * 1) Backbone View container derived from
 *      Oskari.integration.bundle.bb.View
 * - a reference to implementing file in /bundles...
 *
 * 2) LOCALISATION file references
 * - references to locale implementation files in bundles/.../locale/.js
 *
 * 3) Call to Create the BackboneJS Oskari Adapter with appropriate
 * parameters: <Bundle-Name>, <View Class Name>
 *
 * - <Bundle-Name> will be used as key in localisation files
 * - <Bundle-Name> will be used as key to communicating with Oskari sandbox
 *
 * 4) Any reference to CSS files in resources folder
 *
 *
 */
Oskari.clazz.define(
    "Oskari.integration.bundle.admin-layerselector.AdminLayerSelectorBundle",
    function () {},
    {
        "create": function () {
            return Oskari.clazz.create(
                "Oskari.integration.bundle.bb.AdapterBundleInstance",
                "admin-layerselector",
                "Oskari.integration.bundle.admin-layerselector.View"
            );

        },
        "start": function () {},
        "stop": function () {},
        "update": function (manager, bundle, bi, info) {

        }
    },
    {
        "protocol": [
            "Oskari.bundle.Bundle",
            "Oskari.bundle.BundleInstance",
            "Oskari.mapframework.bundle.extension.ExtensionBundle"
        ],
        "source": {
            "scripts": [{
                "type": "text/javascript",
                "src": "../../../../bundles/integration/bundle/admin-layerselector/View.js"

            }, {
                "type": "text/css",
                "src": "../../../../resources/integration/bundle/admin-layerselector/css/style.css"
            }],
            "locales": [
                {
                    "lang": "fi",
                    "type": "text/javascript",
                    "src": "../../../../bundles/integration/bundle/admin-layerselector/locale/fi.js"
                }, {
                    "lang": "en",
                    "type": "text/javascript",
                    "src": "../../../../bundles/integration/bundle/admin-layerselector/locale/en.js"
                }, {
                    "lang": "sv",
                    "type": "text/javascript",
                    "src": "../../../../bundles/integration/bundle/admin-layerselector/locale/sv.js"
                }
                /*        , {
           // NOTE! EXTERNAL LIBRARY!
            "type" : "text/javascript",
            "src" : "../../../../libraries/jquery/plugins/tagIt/tag-it.js"
        }
        ,
        // css
        {
            "type" : "text/css",
            "src" : "../../../../libraries/jquery/plugins/tagIt/jquery.tagit.css"
        },
        {
            "type": "text/javascript",
            "src" : "https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.12/jquery-ui.min.js"
        }
*/
            ],
            "resources": []
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "admin-layerselector",
                "Bundle-Name": "integration.bundle.admin-layerselector",
                "Bundle-Author": [{
                    "Name": "val",
                    "Organisation": "nls.fi",
                    "Temporal": {
                        "Start": "2013",
                        "End": "2013"
                    },
                    "Copyleft": {
                        "License": {
                            "License-Scope": "implementation",
                            "License-Name": "MIT",
                            "License-Online-Resource": "https://github.com/documentcloud/backbone/blob/master/LICENSE"
                        },
                        "License": {
                            "License-Scope": "package",
                            "License-Name": "EUPL",
                            "License-Online-Resource": "http://www.paikkatietoikkuna.fi/license"
                        }

                    }
                }],
                "Bundle-Version": "1.0.0",
                "Import-Namespace": ["Oskari"],
                "Import-Bundle": {}
            }
        }
    }
);

Oskari.bundle_manager.installBundleClass("admin-layerselector", "Oskari.integration.bundle.admin-layerselector.AdminLayerSelectorBundle");