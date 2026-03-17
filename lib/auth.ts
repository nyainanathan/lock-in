import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const SECRET = process.env.JWT_SECRET!;

export function signToken(payload : {userId: number, email : string}){
    return jwt.sign(payload, SECRET, {expiresIn: '7d'});
}

export async function getAuth() : Promise<number> {
    const token = (await cookies()).get('token')?.value;

    if(!token){
        throw new Error("Unauthorized!");
    }

    const payload = jwt.verify(token, SECRET) as { userId : number};

    return payload.userId;
}