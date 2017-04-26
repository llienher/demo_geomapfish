/**
 * Copyright (c) 2011-2017 by Camptocamp SA
 *
 * CGXP is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * CGXP is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

/** api: (define)
 *  module = bl
 *  class = Global
 */

Ext.namespace("bl");

/** api: constructor
 *  .. class:: CustomMenuActionPlugin(config)
 *
 * Plugin to add a multiAttributeEdition button to the feature grid action menu.
 * You must pass a config object with:
 *  'ctx' (Object), the context of the featureGrid to create it.
 *  'layerToUrl' (Object.<string, string>), a key-value object with the layer
 *  name concerned by this plugin as key and corresponding url to open as value.
 *
 */
bl.CustomMenuActionPlugin = function(config) {
    return {
        /** private: property[ctx]
         *  ``Object``
         * Context of the featureGrid plugin
         */
        _ctx: config.ctx || {},

        /** private: property[layerToUrl]
         *  ``Object``
         * A key-value (string-string) object with the layer name concerned by
         * this plugin as key and corresponding url to open as value.
         */
        _layerToUrl: config.layerToUrl || {},

        /** api: method[buttonMustBeAdded]
         *  True if the button must be added to the menu in the urrent context.
         *
         *  :return ``Boolean`` Must be added or not.
         */
        buttonMustBeAdded: function() {
            // Is the layer on which we want the multiple edition button ?
            var isGoodLayer = Object.keys(this._layerToUrl).indexOf(
                    this._ctx.currentGrid.title) > -1;
            // Have the data a fid ?
            var hasIds = function() {
                var selection = this._ctx.currentGrid.selection;
                for (var i = 0; i < selection.length; i++) {
                    if (selection[i].data.fid !== undefined) {
                      return true;
                    }
                }
                return false;
            }.bind(this)();
            return isGoodLayer && hasIds;
        },
    
        /** api: method[addCustomMenu]
         *  Create and add the custom menu to the mainActionMenu.
         */
        addCustomMenu: function() {
            var actionMainMenu = this._ctx.selectionActionButton.menu;
            if (actionMainMenu.items.length < 3) {
                // Create a custom action menu with function to open a link
                // with the ids of current selected lines in params.
                var myCustomActionMenu = {
                    text: OpenLayers.i18n('Edit these features'),
                    handler: function() {
                        var selection = this._ctx.currentGrid.selection;
                        var fid, ids = [];
                        for (var i = 0; i < selection.length; i++) {
                            fid = selection[i].data.fid;
                            if (fid) {
                                // Remove the layer name part then add the id.
                                ids.push(fid.split('.')[1]);
                            }
                        }
                        var baseUrl = this._layerToUrl[this._ctx.currentGrid.title];
                        window.location = baseUrl + '?ids=' + ids.join(',');
                    }.bind(this)
                }
    
                // Add the custom menu
                actionMainMenu.addMenuItem(myCustomActionMenu);
                this._repaintMenu(true);
            }
        },
        
        /** api: method[removeCustomMenu]
         *  Remove the custom menu from the mainActionMenu.
         */ 
        removeCustomMenu: function() {
            var actionMainMenu = this._ctx.selectionActionButton.menu;
            if (actionMainMenu.items.length > 2) {
                actionMainMenu.remove(actionMainMenu.items.get(2));
                this._repaintMenu(false);
            }
        },
    
        /** private: method[repaintMenu]
         *  Repaint the menu - Pass through a visual bug from adding a menu on
         *  the fly.
         *  The params says if we have added a menu or not to repaint the menu
         *  at the right height.
         *
         *  :arg options: ``Boolean`` wasAdded, a menu was added or removed ?
         */ 
        _repaintMenu: function(wasAdded) {
            var actionMainMenu = this._ctx.selectionActionButton.menu;
            var pos = actionMainMenu.getPosition();
            var elementHeight = actionMainMenu.items.get(0).getEl().getHeight();
            elementHeight = elementHeight + 2 // + 2 for margin
            if (wasAdded) {
              elementHeight = elementHeight * -1;
            }
            pos = [pos[0], pos[1] + elementHeight];
            actionMainMenu.hide();
            actionMainMenu.showAt(pos);
        }
    }
}
