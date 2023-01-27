var XanPoolWidget = /** @class */ (function () {
    function XanPoolWidget(options, rootNode, callback) {
        this.widgetUrl = 'https://widget.xanpool.com';
        this.url = this.constructUrl(options);
        this.rootNode = rootNode;
        this.callback = callback;
        /*Changed by WebPack*/
    }
    XanPoolWidget.prototype.init = function () {
        var iframeNode = document.createElement('iframe');
        iframeNode.src = this.url;
        iframeNode.frameBorder = 'no';
        iframeNode.id = 'xpWidgetIframe';
        iframeNode.scrolling = 'no';
        iframeNode.style = 'width:100%; border: 0; overflow:hidden;';
        this.rootNode.appendChild(iframeNode);
        this.iframeNode = iframeNode;
        window.addEventListener('message', this.onMessage.bind(this), false);
    };
    XanPoolWidget.prototype.constructUrl = function (options) {
        if (!options.apiKey && !options.requestId) {
            throw new Error('Neither apiKey nor requestId are provided');
        }
        var url = this.widgetUrl + '?';
        if (options.apiKey) {
            url += 'apiKey=' + options.apiKey;
        }
        if (options.requestId) {
            url += 'requestId=' + options.requestId;
        }
        var extraParams = [
            'transactionType',
            'cryptoCurrency',
            'currency',
            'method',
            'chain',
            'redirectUrl',
            'fiat',
            'crypto',
            'lang',
            'destinationTag',
        ];
        for (var _i = 0, extraParams_1 = extraParams; _i < extraParams_1.length; _i++) {
            var param = extraParams_1[_i];
            if (options[param]) {
                url += "&" + param + "=" + options[param];
            }
        }
        if (options.wallet) {
            if (!options.cryptoCurrency) {
                throw new Error('cryptoCurrency must be provided when wallet parameter is used');
            }
            url += '&wallet=' + options.wallet;
        }
        if (options.internalAddress) {
            if (options.wallet) {
                throw new Error('Request must either have only wallet or internalAddress');
            }
            url += '&internalAddress=' + encodeURIComponent(options.internalAddress);
        }
        if (options.partnerData) {
            url += '&partnerData=' + encodeURI(options.partnerData);
        }
        if (options.autoSelling && options.autoSelling === true) {
            if (!options.cryptoCurrency) {
                throw new Error('cryptoCurrency must be provided when autoSelling parameter is used');
            }
            url += '&autoSelling=true';
        }
        return url;
    };
    XanPoolWidget.prototype.onMessage = function (event) {
        var msgSource = this.getFrameByEvent(event);
        if (msgSource !== this.iframeNode) {
            return;
        }
        try {
            var message = JSON.parse(event.data);
            switch (message.type) {
                case 'resize':
                    this.onResize(message.payload);
                    break;
                case 'transaction-created':
                    this.callback(message);
                    break;
            }
        }
        catch (ex) {
            // empty on purpose
        }
    };
    XanPoolWidget.prototype.onResize = function (newHeight) {
        this.iframeNode.style = 'width:100%;height:' + newHeight + 'px';
        this.rootNode.style = 'height:' + newHeight + 'px';
    };
    XanPoolWidget.prototype.getFrameByEvent = function (event) {
        return [].slice.call(document.getElementsByTagName('iframe')).filter(function (iframe) {
            return iframe.contentWindow === event.source;
        })[0];
    };
    return XanPoolWidget;
}());

window.XanPoolWidget = XanPoolWidget;
window.exports = XanPoolWidget
