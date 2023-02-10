import ErrorResponse from "../utils/errorResponse";
import UserAddress from '../models/address'

exports.addAddress = async (req, res, next) => {
    try {
        const {payload} = req.body;
        if (!payload.address) return next(new ErrorResponse('Params address required', 400))
        if (payload.address._id) {
            const address = await UserAddress.findOneAndUpdate(
                {user: req.user._id, "address._id": payload.address._id},
                {
                    $set: {
                        "address.$": payload.address,
                    },
                }
            )
            if (!address) return next(new ErrorResponse('User address not found', 400))
            return res.status(201).json({address})
        } else {
            const address = await UserAddress.findOneAndUpdate(
                {user: req.user._id},
                {
                    $push: {
                        address: payload.address,
                    },
                },
                {new: true, upsert: true}
            )
            if (!address) return next(new ErrorResponse('User address not be insert', 400))
            return res.status(201).json({address})
        }

    } catch (err) {
        next(err);
    }
}

exports.getAddress = async (req, res, next) => {
    try {
        const userAddress = await UserAddress.findOne({user: req.user._id})
        if (!userAddress) return next(new ErrorResponse('user not found', 400))
        return res.status(200).json({userAddress})
    } catch (err) {
        next(err);
    }
}