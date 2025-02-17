const { getUnselectData, getSelectData } = require("../../utils")


const findAllDiscountCodeUnselect = async ({
    limit = 50, page = 1, sort = "ctime", filter, unSelect, model
}) => {
    const skip = (page - 1) * limit
    const sortby = sort === "ctime" ? { _id: -1 } : { _id: 1 }
    return await model
        .find(filter)
        .sort(sortby)
        .skip(skip)
        .select(getUnselectData(unSelect))
        .lean()
}



const findAllDiscountCodeSelect = async ({
    limit = 50, page = 1, sort = "ctime", filter, select, model
}) => {
    const skip = (page - 1) * limit
    const sortby = sort === "ctime" ? { _id: -1 } : { _id: 1 }
    return await model
        .find(filter)
        .sort(sortby)
        .skip(skip)
        .select(getSelectData(select))
        .lean()
}

const checkDiscountExits = async ({model, filter}) => {
    return await model.findOne(filter);
}


module.exports = { findAllDiscountCodeUnselect, checkDiscountExits, findAllDiscountCodeSelect }