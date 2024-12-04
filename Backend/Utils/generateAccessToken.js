
import jwt from 'jsonwebtoken';
import UserModel from '../Models/user.js';

const generateAccessToken = async (userId) => {
    const token = await jwt.sign(
        { id: userId },
        process.env.SECRET_KEY_ACCESS_TOKEN,
        { expiresIn: '5h' }
    );

    return token;
}


const generateRefreshToken = async (userId) => {
    const token = await jwt.sign(
        { id: userId },
        process.env.SECRET_KEY_REFRESH_TOKEN,
        { expiresIn: '7d' }
    );

    const updateRefreshTokenUser = await UserModel.updateOne(
        { _id: userId },
        {
            refresh_token: token
        }
    );
    return token;
}

export { generateAccessToken, generateRefreshToken };