'use strict'

const redis = require("redis")
const { promisify } = require("util")
const { reservationInventory } = require("../models/repositories/inventory.repo")
const redisClient = redis.createClient()

const pexpire = promisify(redisClient.pexpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setnx).bind(redisClient)

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2025_${productId}`
    const retryTimes = 10
    const expireTime = 3000

    for (let i = 0; i < retryTimes; i++) {
        // tạo mot key, use nào giữ sẽ được vào thanh toán
        const result = await setxnAsync(key, expireTime)
        console.log("result", result)
        if (result == 1) {
            // thao tác với inventory
            const isInventory=await reservationInventory(productId,quantity,cartId)
            if(isInventory.modifiedCount){
                await pexpire(key,expireTime)
                return key;
            }
            return null
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }
    }
}

const releaseLock = async keyLock => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(keyLock)
}

module.exports = {
    acquireLock,
    releaseLock
}







