const { finById } = require("../services/apiKey.service")
const HEADER = {
    API_KEY: "x-api-key",
    AUTHORIZATION: "authorization"
}
//cấp quyền truy cập user
const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString() 
        if (!key) {
            return res.status(403).json({
                message: "forbidden error"
            })
        }
        // check apikey
        const objKey = await finById(key)
        if (!objKey) {
            return res.status(403).json({
                message: "forbidden error"
            })
        }
        res.objKey = objKey
        next()
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}
 

module.exports={apiKey}