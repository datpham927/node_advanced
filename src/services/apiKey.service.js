const apiKeyModel = require("../models/apikey.model")

const finById = async (key) => {
  try {
    const objKey = await apiKeyModel.findOne({ key, status: true }).lean()
    return objKey
  } catch (error) {
    return  error
  }
}

module.exports = {finById}