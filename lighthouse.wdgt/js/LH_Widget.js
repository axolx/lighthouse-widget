/**
* @class LH_Widget
*      The Widget UI
*/
function LH_Widget() {
}

LH_Widget.prototype.init = function() {

    this.front = dojo.byId('front');
    this.back = dojo.byId('back');

    // Info button
    this.info = new AppleInfoButton(dojo.byId('info'), dojo.byId('front'),
        'white', 'white', dojo.hitch(this, this.showPrefs));

    // Reload button
    this.reload = new ReloadButton(dojo.byId('reload'), dojo.byId('reload'),
        'white', 'white', dojo.hitch(this, function() {
            this.lh.getTickets(dojo.byId('choices').value);
        }));

    // Save preferences button
    this.done = new AppleGlassButton(dojo.byId('done'), "Done",
        dojo.hitch(this, this.savePrefs));

    // Watch for change event on bin selector
    dojo.connect(dojo.byId('choices'), 'onchange', this, function() {
        this.lh.getTickets(dojo.byId('choices').value);
    });

    // And start!
    this.startLH();
};

LH_Widget.prototype.startLH = function() {
    try {
        this.getPrefs();
        delete this.lh;
        this.lh = new LH(this.subdomain, this.apiKey, this);
        this.loadBins();
    }
    catch(e) {
        this.setError(e);
    }
};

LH_Widget.prototype.loadBins = function() {
    dojo.empty('choices-optgroup');
    dojo.forEach(this.bins, function(item) {
        var a, o;
        a = item.split('|');
        dojo.create('option', {
            'innerHTML': dojo.trim(a[0]),
            'value': dojo.trim(a[1])
        }, 'choices-optgroup');
    });
    this.lh.getTickets(dojo.byId('choices').value);

};

LH_Widget.prototype.setError = function(str) {
    dojo.empty('error');
    dojo.create('div', {
        innerHTML: str
    }, 'error');
    this.showPrefs();
};

LH_Widget.prototype.setContent = function(dom) {
    var c;
    if(dojo.byId('results') !== null) {
        dojo.destroy(dojo.byId('results'));
    }
    if(dojo.isString(dom)) {
        dom = dojo.create('p', {
            'id': 'results',
            'innerHTML' : dom
        });
    }
    c = dojo.byId('content');
    dojo.place(dom, c);

    if(typeof AppleScrollArea !== 'undefined'|| typeof this.scrollArea == 'undefined') {
        this.scrollBar = new AppleVerticalScrollbar(dojo.byId('scrollBar'));
        this.scrollArea = new AppleScrollArea(c, this.scrollBar);
    }
    // @todo scroll bar should not appear if there's no need for it. see
    // this.scrollArea.viewToContentHeightRatio
    this.scrollBar.refresh();
};

/**
 * @see http://developer.apple.com/library/mac/#documentation/AppleApplications/Conceptual/Dashboard_ProgTopics/Articles/Preferences.html
 */
LH_Widget.prototype.showPrefs = function(event) {

    if (window.widget) {
        widget.prepareForTransition("ToBack");
    }

    this.front.style.display="none";
    this.back.style.display="block";

    if (window.widget) {
        setTimeout ('widget.performTransition();', 0);
    }
};

LH_Widget.prototype.hidePrefs = function(event) {

    this.back.style.display="none";
    this.front.style.display="block";

    if (window.widget) {
        widget.prepareForTransition("ToFront");
        setTimeout ('widget.performTransition();', 0);
    }
};

LH_Widget.prototype.savePrefs = function() {
    var v = dojo.formToObject(dojo.byId('settings'));
    if(window.widget) {
        if(typeof v.subdomain !== 'undefined') {
            widget.setPreferenceForKey(v.subdomain, "subdomain");
        }
        if(typeof v.apiKey !== 'undefined') {
            widget.setPreferenceForKey(v.apiKey, "apiKey");
        }
        if(typeof v.bins !== 'undefined') {
            widget.setPreferenceForKey(dojo.toJson(v.bins.split("\n")), "bins");
        }
    }
    this.startLH();
    this.hidePrefs();
};

LH_Widget.prototype.getPrefs = function() {
    if(window.widget) {
        var prefs = ['subdomain', 'apiKey', 'bins'];
        dojo.forEach(prefs, function(item) {
            var p = widget.preferenceForKey(item);
            if(p && p.length > 0) {
                if(item == 'bins') {
                    var j = dojo.fromJson(p);
                    this[item] = j;
                    dojo.attr(item,'value', j.join("\n"));
                }
                else {
                    this[item] = p;
                    dojo.attr(item,'value',p);
                }
            }
        }, this);
    }
    if(!this.subdomain || !this.apiKey) {
        throw new Error('Subdomain and API Key must be set.');
    }
    return true;
};



