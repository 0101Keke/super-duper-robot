
class ErrorViewModel {
    constructor(requestId = null) {
        this.requestId = requestId;
    }

    get showRequestId() {
        return this.requestId !== null && this.requestId !== undefined && this.requestId !== '';
    }

    toJSON() {
        return {
            requestId: this.requestId,
            showRequestId: this.showRequestId
        };
    }
}

module.exports = ErrorViewModel;