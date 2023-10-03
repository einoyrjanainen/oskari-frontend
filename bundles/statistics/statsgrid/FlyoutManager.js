import { getNavigationDimensions } from 'oskari-ui/components/window';

Oskari.clazz.define('Oskari.statistics.statsgrid.FlyoutManager', function (instance, service, handler) {
    this.instance = instance;
    this.flyouts = {};
    var loc = instance.getLocalization();
    Oskari.makeObservable(this);
    this.service = instance.getStatisticsService().getStateService();
    this._positionY = 5;
    this.searchHandler = handler;
    this.flyoutInfo = [
        {
            id: 'search',
            title: loc.tile.search
        },
        {
            id: 'table',
            title: loc.tile.table,
            oskariClass: 'Oskari.statistics.statsgrid.view.TableFlyout',
            cls: 'statsgrid-data-flyout'
        },
        {
            id: 'diagram',
            title: loc.tile.diagram,
            oskariClass: 'Oskari.statistics.statsgrid.view.DiagramFlyout',
            cls: 'statsgrid-diagram-flyout',
            resizable: true,
            minWidth: 630,
            minHeight: 400

        },
        {
            id: 'indicatorForm',
            hideTile: true,
            title: loc.userIndicators.flyoutTitle || 'Add indicator',
            oskariClass: 'Oskari.statistics.statsgrid.view.IndicatorFormFlyout',
            cls: 'statsgrid-user-indicator-flyout'
        }
    ];
}, {
    init: function () {
        if (Object.keys(this.flyouts).length) {
            // already initialized
            return;
        }

        const navDimensions = getNavigationDimensions();
        var position = navDimensions.right;
        const y = this._positionY;
        const container = jQuery(Oskari.dom.getRootEl());
        this.flyoutInfo.forEach((info) => {
            if (info.id === 'search') {
                this.flyouts[info.id] = true;
            } else {
                var flyout = Oskari.clazz.create(info.oskariClass, info.title, {
                    width: 'auto',
                    cls: info.cls,
                    container,
                    position: {
                        x: position,
                        y
                    }
                }, this.instance);
                flyout.makeDraggable({
                    handle: '.oskari-flyouttoolbar, .statsgrid-data-container > .header',
                    scroll: false
                });

                flyout.bringToTop();
                flyout.on('hide', () => {
                    this.trigger('hide', info.id);
                });
                this.flyouts[info.id] = flyout;
                position = position + flyout.getSize().width;
                if (info.resizable) {
                    const { minWidth, minHeight } = info;
                    flyout.makeResizable({
                        minWidth,
                        minHeight
                    });
                }
            }
        });
    },
    open: function (type) {
        var me = this;
        var flyout = me.flyouts[type];
        if (!flyout) {
            return;
        }
        if (type === 'search') {
            this.searchHandler.getController().toggleSearchFlyout(true);
        } else {
            flyout.showOnPosition();
            this.trigger('show', type);
        }
    },
    hide: function (type) {
        var me = this;
        var flyout = me.flyouts[type];
        if (!flyout) {
            return;
        }
        if (type === 'search') {
            this.searchHandler.getController().toggleSearchFlyout(false);
        } else {
            flyout.hide();
        }
    },
    toggle: function (type) {
        var flyout = this.getFlyout(type);
        if (!flyout) {
            // unrecognized flyout
            return;
        }
        if (flyout.isVisible()) {
            if (type === 'search') {
                this.searchHandler.getController().toggleSearchFlyout(false);
                return;
            } else {
                this.hide(type);
                return;
            }
        }
        // open flyout
        if (type === 'search') {
            this.searchHandler.getController().toggleSearchFlyout(true);
        } else {
            this.open(type);
        }
    },
    getFlyout: function (type) {
        return this.flyouts[type];
    },
    tileAttached: function () {
        if (this.service.hasIndicators()) {
            return;
        }
        this.open('search');
    },
    tileClosed: function () {
        this.hide('search');
    },
    hideFlyouts: function () {
        Object.keys(this.flyouts).forEach(type => {
            if (type === 'search') return;
            this.hide(type);
        });
    }

});
