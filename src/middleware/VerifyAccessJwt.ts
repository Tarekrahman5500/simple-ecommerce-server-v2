import { Request } from 'express';
import { expressjwt } from "express-jwt";
import env from '../util/validateEnv'
import {Jwt} from "jsonwebtoken";
import {Payload} from "../types/decs";

// function that allow only  for admin or  user to access the application
function AdminAuthJwt(role: "admin" | "user") {
  const secret = env.JWT_SECRET;
//  const api = process.env.API_URL;

  return expressjwt({
    secret,
    algorithms: ['HS256'],
      isRevoked: (req, token) => isRevoked(req, token, role)
  }).unless({
      // path that can be access without login
    path: [
     // if not admin so there is nothing to do
    ]
  });
}

async function isRevoked(req: Request, token: Jwt | undefined, role: "admin" | "user"): Promise<boolean> {

   // console.log(token)
  const payload = token?.payload as Payload
  return !(payload.role === role);
}

export default  AdminAuthJwt;
