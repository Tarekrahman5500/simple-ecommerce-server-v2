import {Request} from 'express';
import {expressjwt} from "express-jwt";
import env from '../util/validateEnv'
import {getRoleUser, Payload} from "../types/decs";
import {Jwt} from "jsonwebtoken";
import User from "../model/user";

// function that allow only login user to access the application
function authJwt() {
    const secret = env.JWT_SECRET;
//  const api = process.env.API_URL;

    return expressjwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        // path that can be access without login
        path: [
            // user can see product image
            {url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS']},
            // a user can check product
            {url: /\/api\/product(.*)/, methods: ['GET', 'OPTIONS']},
            // a user can check categories
            {url: /\/api\/categorie(.*)/, methods: ['GET', 'OPTIONS']},
            // a user can register
            {url: /\/api\/user\/signin/, methods: ['POST']},
            // a user can log in
            {url: /\/api\/user\/login/, methods: ['POST']},
        ]
    });
}

async function isRevoked(req: Request, token: Jwt | undefined): Promise<boolean> {
    // console.log(token)
    const payload = token?.payload as Payload
    // console.log(payload._id)
    const user = await User.findById((payload._id)).select('role') as getRoleUser
    // console.log(user)
    return !(user.role === 'user' || user.role === 'admin');
}

export default authJwt;


