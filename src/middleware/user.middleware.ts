import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

@Injectable()
export  class UserMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const { authorization } = req.headers;
        if (authorization) {
            try {
                const decoded = jwt.verify(authorization, JWT_SECRET)
                res.locals.user = decoded
                next()
            } catch (error) {
                return res.status(401).send('Unauthorized')
            }
        } else {
            return res.status(401).send('Unauthorized')
        }
    }
}