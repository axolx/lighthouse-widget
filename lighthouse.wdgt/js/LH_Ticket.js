/**
* @class LH_Ticket
*      A Lighthouse ticket
*/
function LH_Ticket(json) {
    this.title = json.ticket.title;
    this.url = json.ticket.url;
}

LH_Ticket.prototype.toDom = function() {
    var a = dojo.create("a", {
        innerHTML: this.title,
        href: '#',
        _target: 'blank',
        title: this.title,
        className: 'ticket'
    });
    dojo.connect(a, 'onclick', this, function() {
        widget.openURL(this.url);
    });
    return a;
};