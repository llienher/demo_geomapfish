<%
from json import dumps
%>
Ext.onReady(function() {
    /*
     * Initialize the application.
     */
    // OpenLayers
    OpenLayers.Number.thousandsSeparator = ' ';
    OpenLayers.DOTS_PER_INCH = 72;
    OpenLayers.ProxyHost = "${request.route_url('ogcproxy')}?url=";

    // Ext
    Ext.QuickTips.init();

    OpenLayers.ImgPath = "${request.static_url('demo:static/lib/cgxp/core/src/theme/img/ol/')}";
    Ext.BLANK_IMAGE_URL = "${request.static_url('demo:static/lib/cgxp/ext/Ext/resources/images/default/s.gif')}";

    // Apply same language than on the server side
    OpenLayers.Lang.setCode("${lang}");
    GeoExt.Lang.set("${lang}");

    // Server errors (if any)
    var serverError = ${serverError | n};

    // Themes definitions
    var THEMES = {
        "local": ${themes | n}
% if external_themes:
        , "external": ${external_themes | n}
% endif
    };

    <% bounds = user.role.bounds if user else None %>
% if bounds:
    var INITIAL_EXTENT = ${dumps(bounds)};
% else:
    var INITIAL_EXTENT = [529000, 147000, 555000, 161000];
% endif

    var RESTRICTED_EXTENT = [529000, 147000, 555000, 161000];
    var MAX_EXTENT = [420000, 30000, 900000, 350000];

    // Used to transmit event throw the application
    var EVENTS = new Ext.util.Observable();

    var WMTS_OPTIONS = {
        url: ${tiles_url | n},
        displayInLayerSwitcher: false,
        requestEncoding: 'REST',
        buffer: 0,
        transitionEffect: "resize",
        visibility: false,
        style: 'default',
        dimensions: ['TIME'],
        params: {
            'time': '2011'
        },
        matrixSet: 'c2cgp',
        projection: new OpenLayers.Projection("EPSG:21781"),
        units: "m",
        formatSuffix: 'png',
        serverResolutions: [156543.03390625,78271.516953125,39135.7584765625,19567.87923828125,9783.939619140625,4891.9698095703125,2445.9849047851562,1222.9924523925781,611.4962261962891,305.74811309814453,152.87405654907226,76.43702827453613,38.218514137268066,19.109257068634033,9.554628534317017,4.777314267158508,2.388657133579254,1.194328566789627,0.5971642833948135]
    };

    var WMTSASITVD_OPTIONS2 = {
        url: "http://ows.asitvd.ch/wmts/",
        displayInLayerSwitcher: false,
        requestEncoding: 'REST',
        buffer: 0,
        style: 'default',
        dimensions: ['DIM1','ELEVATION'],
        params: {
            'dim1': 'default',
            'elevation': '0'
        },
        matrixSet: "21781",
        maxExtent: new OpenLayers.Bounds(420000,30000,900000,350000),
        projection: new OpenLayers.Projection("EPSG:21781"),
        units: "m",
        format: "image/png",
        formatSuffix: 'png',
        opacity: 1,
        visibility: true,
        serverResolutions: [4000.0,3750.0,3500.0,3250.0,3000.0,2750.0,2500.0,2250.0,2000.0,1750.0,1500.0,1250.0,1000.0,750.0,650.0,500.0,250.0,100.0,50.0,20.0,10.0,5.0,2.5,2.0,1.5,1.0,0.5,0.25,0.1,0.05]
    };

    app = new gxp.Viewer({

        // viewer config
        portalConfig: {
            layout: 'border',
            ctCls: 'x-map',
            items: [
                'app-map',
            {
                id: 'left-panel',
                region: 'west',
                width: 300
            }]
        },

        // tools
        tools: [{
            ptype: 'cgxp_editing',
            layerTreeId: 'layertree',
            layersURL: "${request.route_url('layers_root')}"
        },
        {
            ptype: "cgxp_mapopacityslider",
            defaultBaseLayerRef: "${functionality['default_basemap'][0] | n}" //FUNCTIONALITY.default_basemap[0]
        },
        {
            ptype: 'cgxp_themeselector',
            outputTarget: 'left-panel',
            outputConfig: {
                layout: 'fit',
                style: 'padding: 3px;'
            },
            layerTreeId: 'layertree',
            themes: THEMES
        },
        {
            ptype: "cgxp_layertree",
            id: "layertree",
            events: EVENTS,
            outputConfig: {
                header: false,
                flex: 1,
                layout: 'fit',
                autoScroll: true,
                themes: THEMES,
                wmsURL: '${request.route_url('mapserverproxy')}',
                defaultThemes: ["Administration"],
            },
            outputTarget: 'left-panel'
        },
        {
            ptype: "cgxp_fulltextsearch",
            url: "${request.route_url('fulltextsearch')}",
            layerTreeId: "layertree",
            pointRecenterZoom: 20,
            actionTarget: "map.tbar",
            grouping: true
        },
        {
            ptype: "cgxp_menushortcut",
            type: '->'
        },
        {
            ptype: "cgxp_permalink",
            id: "permalink",
            actionTarget: "map.tbar",
            shortenerCreateURL: "${request.route_url('shortener_create')}",
            actionConfig: {
                text: OpenLayers.i18n("Link")
            }
        },
        {
            ptype: "cgxp_login",
            actionTarget: "map.tbar",
            events: EVENTS,
% if user:
            username: "${user.username}",
            isPasswordChanged: ${"true" if user.is_password_changed else "false"},
% endif
            loginURL: "${request.route_url('login', path='')}",
            loginChangeURL: "${request.route_url('loginchange')}",
            logoutURL: "${request.route_url('logout', path='')}",
            enablePasswordChange: true,
            forcePasswordChange: true,
            permalinkId: "permalink"
        }],

        // layer sources
        sources: {
            "olsource": {
                ptype: "gxp_olsource"
            }
        },

        // map and layers
        map: {
            id: "app-map", // id needed to reference map in portalConfig above
            stateId: "map",
            xtype: 'cgxp_mappanel',
            projection: new OpenLayers.Projection("EPSG:21781"),
            extent: INITIAL_EXTENT,
            maxExtent: MAX_EXTENT,
            //restrictedExtent: [420000, 30000, 900000, 350000],
            units: "m",
            //resolutions: [4000,2000,1000,500,250,100,50,20,10,5,2.5,1,0.5,0.25,0.1,0.05],
            //resolutions: [156543.03390625,78271.516953125,39135.7584765625,19567.87923828125,9783.939619140625,4891.9698095703125,2445.9849047851562,1222.9924523925781,611.4962261962891,305.74811309814453,152.87405654907226,76.43702827453613,38.218514137268066,19.109257068634033,9.554628534317017,4.777314267158508,2.388657133579254,1.194328566789627,0.5971642833948135],
            resolutions: [50,20,10,5,2.5,2,1,0.5,0.25,0.1,0.05],
            controls: [
                new OpenLayers.Control.Navigation(),
                new OpenLayers.Control.KeyboardDefaults(),
                new OpenLayers.Control.PanZoomBar({panIcons: false}),
                new OpenLayers.Control.ArgParser(),
                new OpenLayers.Control.Attribution(),
                new OpenLayers.Control.ScaleLine({
                    bottomInUnits: false,
                    bottomOutUnits: false
                }),
                new OpenLayers.Control.MousePosition({numDigits: 0})
            ],
            layers: [{
                source: "olsource",
                type: "OpenLayers.Layer.WMTS",
                group: 'background',
                args: [Ext.applyIf({
                    name: OpenLayers.i18n('asitvd.fond_couleur'),
                    ref: 'asitvd.fond_couleur',
                    layer: 'asitvd.fond_couleur',
                    queryLayers: [],
                    transitionEffect: "resize",
                    group: 'background',
                    visibility: false
                }, WMTSASITVD_OPTIONS2)]
            }],
            items: []
        }
    });

    app.on('ready', function() {
        // remove loading message
        Ext.get('loading').remove();
        Ext.fly('loading-mask').fadeOut({
            remove: true
        });

        if (serverError.length > 0) {
            cgxp.tools.openWindow({
                html: serverError.join('<br />')
            },OpenLayers.i18n("Error notice"),600, 500);
        }
    }, app);
});
