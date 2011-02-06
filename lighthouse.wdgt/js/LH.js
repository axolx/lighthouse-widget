/**
* @class LH
*      Handles interaction with the Lighthouse API
*/
function LH(subdomain, apiKey, lhWidget) {

    this.domain = 'https://' + subdomain + '.lighthouseapp.com';
    this.apiKey = apiKey;
    this.lhWidget = lhWidget;
}

LH.prototype.arrayToList = function(array) {
    var ul = dojo.create("ul", {
        id: 'results'
    });
    dojo.forEach(array, function(data){
        var li = document.createElement('li');
        li.appendChild(data);
        ul.appendChild(li);
    });

    return ul;
};

LH.prototype.getTickets = function(query) {
    dojo.destroy(dojo.byId('results'));
    var req = 'tickets.json?q=' + query;
    this._sendRequest(req, this.parseTickets);
};

LH.prototype.parseTickets = function(json) {
    if(json === null || typeof json.tickets == 'undefined') {
        this.lhWidget.setContent('No matching tickets');
        return;
    }
    var tickets = dojo.map(json.tickets, function(item){
        return (new LH_Ticket(item)).toDom();
    });
    return this.lhWidget.setContent(this.arrayToList(tickets));

};

LH.prototype._sendRequest = function(req, callback) {

    var sort = " sort:'priority,updated'";

    dojo.xhrGet({
        handleAs: 'json',
        url: this.domain + '/' + req + sort,
        timeout: 3000,
        handle: dojo.hitch(this, function(response, ioArgs) {
            if(ioArgs.xhr.status !== 200) {
                this.lhWidget.setError('Unable to load');
            }
        }),
        load: dojo.hitch(this, callback),
        headers: {
            'X-LighthouseToken': this.apiKey
        }
    });

};



