'use strict'
const StatusCode = {
    OK: 200,
    CREATED: 201
}
const ReasonStatusCode = {
    CREATE: "create!",
    OK: "Success!"
}
class SuccessResponse {
    constructor({ message, statusCode, reasonStatusCode, metadata}) {
        this.message = message ? message : reasonStatusCode,
            this.status = statusCode,
            this.metadata = metadata
    }
    send(res, headers = {}) {
        // this =   this.status = statusCode,
        //          this.metadata = metadata
        return res.status(this.status).json(this);
    }
}

class OK extends SuccessResponse {
    constructor({ message, statusCode = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK, metadata: { } }) {
        super({ message, statusCode, reasonStatusCode, metadata })
    }
}

class CREATED extends SuccessResponse {
    constructor({ message, statusCode = StatusCode.CREATED, reasonStatusCode = ReasonStatusCode.CREATE, metadata}) {
        super({ message, statusCode, reasonStatusCode, metadata })
    }
}


module.exports = { OK, CREATED,SuccessResponse }