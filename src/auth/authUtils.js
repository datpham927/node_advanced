const JWT = require("jsonwebtoken");
const asyncHandle = require("../helper/asyncHandle");
const KeyTokenService = require("../services/keyToken.service");
const { ErrorResponse } = require("../core/error.response");
const HEADER = {
   API_KEY: "x-api-key",
   CLIENT_ID: "x-client-id",
   AUTHORIZATION: "authorization",
   REFRESHTOKEN: "x-rtoken-id"
}
const createTokenPairs = async (payload, publicKey, privateKey) => {
   try {
      const accessToken = JWT.sign(payload, publicKey, { expiresIn: 60 * 24 * 60 * 60 });
      const refreshToken = JWT.sign(payload, privateKey, { expiresIn: 60 * 24 * 60 * 60 });
      return { accessToken, refreshToken };
   } catch (error) {
      return error.message;
   }
};
const authentication = asyncHandle(async (req, res, next) => {
   //CLIENT_ID: Id user
   const userId = req.headers[HEADER.CLIENT_ID]

   if (!userId) throw new ErrorResponse("error authentication", 403)
   const keyStore = await KeyTokenService.findByIdUser(userId);

   if (!keyStore) throw new ErrorResponse("user not exits", 201)

   const refreshToken = req.headers[HEADER.REFRESHTOKEN]
   // if (!refreshToken) throw new ErrorResponse("Err", 403)

   // try {
   //    const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
   //    if (userId !== decodeUser._id) throw new ErrorResponse("invalid user", 201)
   //    req.keyStore = keyStore 
   //    req.user = decodeUser 
   //    req.refreshToken=refreshToken
   // } catch (error) {
   //    throw error
   // } 

   const accessToken = req.headers[HEADER.AUTHORIZATION]
   if (!accessToken) throw new ErrorResponse("Err", 403)

   try {
      const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
      if (userId !== decodeUser._id) throw new ErrorResponse("invalid user", 201)
      req.keyStore = keyStore
      req.user = decodeUser
      return next();
   } catch (error) {
      throw error
   }
});

module.exports = { createTokenPairs, authentication };
