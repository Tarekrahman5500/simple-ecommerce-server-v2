import catchAsyncErrors from "../error-handler/catchAsyncError";
import AddressModel, {Address} from "../model/address";
import {IUser} from "../model/category";


export const addAddress = catchAsyncErrors(async (req, res, next) => {
    const {
        name,
        mobileNumber,
        pinCode,
        locality,
        address,
        cityDistrictTown,
        state,
        addressType,
        landmark,
        alternatePhone
    } = req.body;

    // Create the address object from the request body
    const newAddress = {
        name,
        mobileNumber,
        pinCode,
        locality,
        address,
        cityDistrictTown,
        state,
        addressType,
        landmark,
        alternatePhone,
    } as Address

    const auth = req.auth as IUser

    // Find the user's address
    const userAddress = await AddressModel.findOne({user: auth._id});

    if (userAddress) {
        // If the user address exists, update it
        const addressIndex = userAddress.address.findIndex((addr) => addr._id.equals(req.body._id));
        if (addressIndex !== -1) {
            // Update existing address
            userAddress.address[addressIndex] = newAddress;
        } else {
            // Add new address to the user's addresses
            userAddress.address.push(newAddress);
        }

        // Save the updated user address
        const updatedAddress = await userAddress.save();
        return res.status(201).json({address: updatedAddress});
    } else {
        // If user address does not exist, create a new user address
        const newUserAddress = new AddressModel({
            user: auth._id,
            address: [newAddress],
        });
        const savedUserAddress = await newUserAddress.save();
        return res.status(201).json({address: savedUserAddress});
    }

})


export const getAddress = catchAsyncErrors(async (req, res) => {
    const auth = req.auth as IUser
    const userAddress = await AddressModel.findOne({user: auth._id});
    return res.status(200).json({userAddress});
})