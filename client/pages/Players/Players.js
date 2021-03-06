/*
 *
 * Receives and displays the Object retrieved from /server/pages/Players/Players.js
 *
 */
if (!RPG) var RPG = {};
RPG.pagePlayers = new Class({
    Implements : [Events,Options],
    options : {

    },
    initialize : function(options) {
        this.setOptions(options);
        this.element = new Element('div',{
            id : 'pagePlayers'
        });
        this.element.store('instance',this);
    },
    toElement : function() {
        return this.element;
    },
    populate : function(page) {
        this.element.empty();
        if (page && page.pageContents) {
            RPG.elementFactory.page.createElementRecurse(this.element,page.pageContents);
        }
        return this;
    }
});