/**
 * @class Oskari.catalogue.bundle.metadataflyout.view.MetadataPage
 *
 *
 * This hosts metadata content loaded via ajax from
 * Geonetwork
 *
 * Embeds  metadata information.
 *
 */
Oskari.clazz.define('Oskari.catalogue.bundle.metadataflyout.view.MetadataPage',

    /**
     * @method create called automatically on construction
     * @static
     *
     */
    function (instance, locale) {
        /* @property instance bundle instance */
        this.instance = instance;

        /* @property locale locale for this */
        this.locale = locale;
        // We need lancode localizations...
        locale.languages =
            Oskari.getLocalization('DivManazer').LanguageSelect.languages;

        this.asyncTabs = {};
    }, {
        init: function () {},

        /**
         * @private @method _createContent
         * Creates actual tab content from fetched metadata and templates
         *
         * @param {Object} data
         *
         */
        _createContent: function (data) {
            var me = this,
                i,
                model,
                panel,
                template;

            if (data === null || data === undefined) {
                throw new TypeError('_createContent(): missing data.');
            }

            template = _.extend({}, data);
            delete template.identifications;

            if (data.identifications.length === 0) {
                //  No identifications, show metadata not found message
                me._showMetadataNotFoundMessage();
            } else {
                // Create a panel for each identification
                for (i = 0; i < data.identifications.length; i += 1) {
                    model = _.extend({}, template);
                    model.identification = data.identifications[i];
                    panel = Oskari.clazz.create(
                        'Oskari.catalogue.bundle.metadataflyout.view.MetadataPanel',
                        me.instance,
                        me.locale,
                        model
                    );
                    if (me.asyncTabs && !jQuery.isEmptyObject(me.asyncTabs)) {
                        panel.addTabs(me.asyncTabs);
                    }

                    me.addPanel(panel);
                    panel.init(i === 0);
                }
            }
        },

        addTabsAsync: function (data) {
            var me = this;

            if (me.panels && me.panels.length) {
                _.each(me.panels, function (panel) {
                    panel.addTabsAsync(data);
                });
            } else {
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        me.asyncTabs[key] = data[key];
                    }
                }
            }
        },

        /**
         * @private @method _processJSON
         *
         * @param {string} uuid         UUID
         * @param {Object} metadataJSON Metadata object
         *
         */
        _processJSON: function (uuid, metadataJson) {
            var me = this,
                data,
                dataTemplate,
                i,
                identificationTemplate;
            // underscore templates don't like missing values, so let's extend empty strings and arrays...
            dataTemplate = {
                lineageStatements: [],
                dataQualities: [],
                distributionFormats: [],
                fileIdentifier: '',
                identifications: [],
                metadataCharacterSet: '',
                metadataDateStamp: '',
                metadataLanguage: '',
                metadataOrganisationNames: [],
                metadataStandardName: '',
                metadataStandardVersion: '',
                onlineResources: [],
                scopeCodes: []
            };

            identificationTemplate = {
                abstractText: '',
                accessConstraints: [],
                browseGraphics: [],
                citation: {
                    date: {
                        date: '',
                        dateType: ''
                    },
                    resourceIdentifiers: [],
                    title: ''
                },
                classifications: [],
                descriptiveKeywords: [],
                languages: [],
                operatesOn: [],
                otherConstraints: [],
                responsibleParties: [],
                serviceType: '',
                spatialRepresentationTypes: [],
                spatialResolutions: [],
                temporalExtents: [],
                topicCategories: [],
                useLimitations: []
            };

            data = _.extend(dataTemplate, metadataJson);

            data.lineageStatements.forEach(function (lineage, index) {
                data.lineageStatements[index] = me._prettify(lineage);
            });

            data.dataQualities.forEach(function (dataQuality) {
                dataQuality.UIlabel = me.locale.heading[dataQuality.nodeName];
            });

            for (i = 0; i < data.identifications.length; i += 1) {
                data.identifications[i] =
                    _.extend(identificationTemplate, data.identifications[i]);
            }

            data.identifications.forEach(function (identification) {
                // Split abstract text to paragraphs and make links into anchors
                identification.abstractText =
                    me._prettify(identification.abstractText);

                if (!identification.browseGraphics) {
                    identification.browseGraphics = [];
                }

                if (!identification.citation) {
                    identification.citation = {};
                }

                if (identification.citation.title === undefined) {
                    identification.citation.title = '';
                }

                if (!identification.otherConstraints) {
                    identification.otherConstraints = [];
                }

                for (i = 0; i < identification.otherConstraints.length; i += 1) {
                    identification.otherConstraints[i] =
                        me._prettify(identification.otherConstraints[i]);
                }

                if (!identification.useLimitations) {
                    identification.useLimitations = [];
                }

                for (i = 0; i < identification.useLimitations.length; i += 1) {
                    identification.useLimitations[i] =
                        me._prettify(identification.useLimitations[i]);
                }
            });

            data.uuid = uuid;
            me._createContent(data);
        },

        /**
         * @private @method _prettify
         * Chops the text into paragraphs, makes links into anchors.
         *
         * @param {string} text Text
         *
         */
        _prettify: function (text) {
            var me = this,
                ret = [];
            if (text) {
                text.split('\n').forEach(
                    function (paragraph) {
                        ret.push(
                            me._linkify(paragraph.trim())
                        );
                    }
                );
            }
            return ret;
        },

        /**
         * @private @method _getMetadata
         * This is the actual data loader function
         *
         * @param {string} uuid UUID
         * @param {string} metadataUrl Metadata url
         *
         */
        _getMetadata: function (uuid, metadataUrl) {
            var me = this;

            if (uuid === null || uuid === undefined) {
                throw new TypeError(
                    '_getMetadata(): missing uuid'
                );
            }

            me.instance.getLoader().getCSWData(
                uuid,
                Oskari.getLang(),
                metadataUrl,
                // TODO add sensible error handling
                function (data) {
                    me._processJSON(uuid, data);
                },
                function (jqXHR, exception) {
                    // Request failed, show generic message to user
                    me._showMetadataNotFoundMessage();
                }
            );
            return true;
        },

        /**
         * @method showMetadata
         *
         * Launches Ajax requests to embed metadata descriptions
         * for requested metadata
         *
         * Backend provides HTML setups that will be embedded and
         * styled with bundled CSS.
         *
         * @param {string} uuid UUID
         * @param {string} metadataUrl Metadata url
         *
         */
        showMetadata: function (uuid, metadataUrl) {
            if (uuid === null || uuid === undefined) {
                // Not a major error, keep on rolling
                this.instance.getSandbox().printError(
                    'showMetadata(): Missing uuid.'
                );
                return;
            }

            this._getMetadata(uuid, metadataUrl);
        },

        /**
         * @method scheduleShowMetadata
         *
         * this 'schedules' asyncronous loading
         * ( calls directly now )
         * Used to buffer excess calls. Main entry point.
         *
         * @param {string} uuid UUID
         * @param {string} metadataUrl Metadata url
         *
         */
        scheduleShowMetadata: function (uuid, metadataUrl) {
            if (uuid === null || uuid === undefined) {
                // Not a major error, keep on rolling
                this.instance.getSandbox().printError(
                    'scheduleShowMetadata(): Missing uuid.'
                );
                return;
            }
            this.showMetadata(uuid, metadataUrl);
        },

        /**
         * @private @method _linkify
         * FIXME use the original linkify if possible?
         * slightly modified  http://code.google.com/p/jquery-linkify/
         *
         * @param {string} inputText
         *
         */
        _linkify: function (inputText) {
            var replacePattern,
                replacedText;

            // URLs starting with http://, https://, or ftp://
            replacePattern =
                /(\b(https?|ftp):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gim;
            replacedText = inputText.replace(
                replacePattern,
                '<a href="$1" target="_blank">$1</a>'
            );

            // URLs starting with www.
            // (without // before it, or it'd re-link the ones done above)
            replacePattern = /(^|[^/])(www\.[\S]+(\b|$))/gim;
            replacedText = replacedText.replace(
                replacePattern,
                '$1<a href="http://$2" target="_blank">$2</a>'
            );

            // Change email addresses to mailto:: links
            // replacePattern = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
            // replacedText = replacedText.replace(
            //    replacePattern,
            //    '<a href="mailto:$1">$1</a>'
            // );

            return replacedText;
        },

        /**
         * @method showErrorMessage
         * Render 'metadata not found' message to ui
         */
        _showMetadataNotFoundMessage: function () {
            this.ui.text(this.locale.notFound);
        }

    }, {
        extend: ['Oskari.userinterface.component.Accordion']
    });
