"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const user_1 = require("../model/user");
const signToken_1 = __importDefault(require("../util/signToken"));
const validation_1 = __importDefault(require("../middleware/validation"));
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const ApiError_1 = __importDefault(require("../Error/ApiError"));
const dotenv_1 = __importDefault(require("dotenv"));
const userValidators_1 = require("../util/validators/userValidators");
const bcrypt_1 = require("bcrypt");
const mailing_1 = __importDefault(require("../util/mailing"));
const token_1 = require("../model/token");
const jsonwebtoken_1 = require("jsonwebtoken");
dotenv_1.default.config();
const store = new user_1.User();
const reset = new token_1.Token();
const { JWT_SECRET, JWT_ACCESS_EXPIRY, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRY, SR, JWT_EMAIL, JWT_EMAIL_EXPIRY, } = process.env;
const index = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield store.index();
        res.json({ message: 'retrived users sucessfully', data: users });
    }
    catch (err) {
        throw new Error(`couldn't get users, ${err}`);
    }
});
const show = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield store.show(req.params.author);
        if (!user.author) {
            return next(new ApiError_1.default(`couldn't find user ${req.params.author}`, 404, 'failed while trying to get the user', true));
        }
        res.json({
            message: 'retrived the user',
            author: user.author,
            posts: user.posts,
        });
    }
    catch (err) {
        throw new Error(`couldn't find user,${req.params.id} , ${err}`);
    }
});
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield store.delete(req.params.id);
        res.json({ message: ' the user is deleted', data: user });
    }
    catch (err) {
        throw new Error(`couldn't delete user,${req.params.id} , ${err}`);
    }
});
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield store.getById(req.params.id);
    if (!user || user.id !== res.locals.userId) {
        return next(new ApiError_1.default(`couldn't update user ${req.params.id}`, 422, 'failed while trying to update the user', true));
    }
    yield store.updateProfile(req.params.id, req.body.bio);
    res.status(200).json({ message: 'user bio is updated' });
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield store.create(req.body);
    if (!user) {
        return next(new ApiError_1.default(`couldn't create user ${req.params.id}`, 404, 'failed while trying to create the user', true));
    }
    const confirmToken = (0, signToken_1.default)({ id: user.id }, JWT_EMAIL + '', JWT_EMAIL_EXPIRY + '');
    const link = `https://small-blog-api.onrender.com/users/confirm/${confirmToken}`;
    (0, mailing_1.default)(user.email, 'Email Confirmation', link, user.name);
    res.status(201).json({ message: 'user created', user });
});
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const jwtCookie = req.cookies['refresh-token'];
        const { email, password } = req.body;
        const user = yield store.authenticate(email, password);
        if (!user) {
            return next(new ApiError_1.default(`Invalid email or password`, 404, 'failed to authenticate the user', true));
        }
        if (user.confirmed === false) {
            return next(new ApiError_1.default(`Please confirm your email.`, 401, 'User must confirm email to be able to login', true));
        }
        const { id, name } = user;
        const token = (0, signToken_1.default)({ id, name, email }, JWT_SECRET + '', JWT_ACCESS_EXPIRY + '');
        const refreshToken = (0, signToken_1.default)({ id, name, email }, JWT_REFRESH_SECRET + '', JWT_REFRESH_EXPIRY + '');
        // ? remove the old token if exists in cookie
        let newRefreshTokens = (!jwtCookie
            ? user.refreshtoken
            : (_a = user.refreshtoken) === null || _a === void 0 ? void 0 : _a.filter((rt) => rt !== jwtCookie));
        if (jwtCookie) {
            // ! if user logs in, never logs out or use RT (we must check for reuse detection so same refresh token not used in 2 logins or more)
            const foundToken = yield store.showByToken(jwtCookie);
            if (!foundToken) {
                // ? now we are sure the token is deleted and was used before
                newRefreshTokens = [];
            }
            res.clearCookie('refresh-token', {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
            });
        }
        if (!newRefreshTokens) {
            newRefreshTokens = [];
        }
        yield store.storeToken(email, [...newRefreshTokens, refreshToken]);
        res.cookie('refresh-token', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'none',
            secure: true,
        });
        res.status(200).json({ id: user.id, name: user.name, accessToken: token });
    }
    catch (err) {
        throw new Error(`couldn't authenticate user, ${req.body.email} , ${err}`);
    }
});
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield store.validate(req.body.email);
        if (!user) {
            return next(new ApiError_1.default(`User doesn't exist..`, 404, 'failed to authenticate the user', true));
        }
        const resetCode = Math.floor(100000 + Math.random() * 900000) + ''; // NOTE  ensuring first digit will never be 0
        const resetToken = crypto_1.default.randomBytes(20).toString('hex');
        const hashedToken = yield (0, bcrypt_1.hash)(resetToken, Number(SR));
        const hashedCode = crypto_1.default
            .createHash('sha512')
            .update(resetCode)
            .digest('hex');
        // !  HERE  instead of removing all previous reset Tokens, ordering tokens and get last one (DESC) and once user reset password we delete all he created before
        yield reset.removeToken(user.id + '');
        yield reset.createToken(hashedToken, hashedCode, user.id);
        // NOTE saved hashs will be later compared to see if we really got valid request or not, resetToken valid for 15min, check if verified
        const link = `https://small-blog-api.onrender.com/reset?token=${resetToken}&id=${user.id}`;
        (0, mailing_1.default)(user.email, 'Password Reset Request', link, user.name, resetCode);
        res.status(200).send({ message: 'An E-mail has been sent.' });
    }
    catch (err) {
        // NOTE we may delete all info we saved if an error happened
        console.log(err);
    }
});
const checkResetCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, id } = req.query;
        const storedToken = yield reset.getToken(id + '');
        if (!storedToken) {
            return next(new ApiError_1.default(`Invalid or expired password reset token`, 404, 'failed to authenticate the user', true));
        }
        if (!(yield (0, bcrypt_1.compare)(token + '', storedToken.token)) ||
            crypto_1.default.createHash('sha512').update(req.body.code).digest('hex') !==
                storedToken.code) {
            return next(new ApiError_1.default(`Expired password reset token or wrong code`, 404, 'failed to authenticate the user', true));
        }
        yield reset.verifiedCode(id + '');
        res.status(200).send({
            message: 'The reset code has been verified you are ready to change the password',
        });
    }
    catch (err) {
        res
            .status(422)
            .json({ message: 'error occured while verifying reset code' });
    }
});
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        const { password } = req.body;
        // HERE  verifying that the user indeed exists
        // const user = await store.getById(id);
        // if (!user) {
        //   return next(
        //     new APIError(
        //       `Cannot find the user with Id: ${id}`,
        //       404,
        //       'failed to get the user',
        //       true
        //     )
        //   );
        // }
        const storedToken = yield reset.getToken(id + '');
        if (!(storedToken === null || storedToken === void 0 ? void 0 : storedToken.verified)) {
            return next(new ApiError_1.default(`Password reset code is not verified you are not allowed to change password.`, 403, 'Not verified reset token', true));
        }
        yield store.update(id + '', password);
        yield reset.removeToken(id + '');
        res
            .status(200)
            .send({ message: 'You changed your password successfully.' });
    }
    catch (err) {
        console.log(err);
    }
});
const confirmEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // NOTE  we need to validate if the user is confirmed or not
        const { token } = req.params;
        const { user: { id }, } = (0, jsonwebtoken_1.verify)(token, JWT_EMAIL + '');
        const user = yield store.getById(id + '');
        if (!user || user.confirmed) {
            return next(new ApiError_1.default(`The Link expired or no user found.`, 403, "the user is trying to confirming an email which is alread confirmed or a user that doesn't exists", true));
        }
        yield store.confirmUser(id + '');
        res
            .status(302)
            .redirect('https://small-blog-react.vercel.app/login?confirmed=true');
    }
    catch (err) {
        res.sendStatus(403);
    }
});
const userRoutes = (app) => {
    // ! Development purpose only
    app.get('/users', index);
    app.delete('/users/:id', verifyToken_1.default, remove);
    // HERE  . our used routes
    app.patch('/users/:id', verifyToken_1.default, (0, userValidators_1.validateUserUpdate)(), validation_1.default, update);
    app.get('/users/:author', verifyToken_1.default, show);
    app.post('/users/signup', (0, userValidators_1.validateUserCreate)(), validation_1.default, create);
    app.post('/users/login', (0, userValidators_1.validateUserAuthenticate)(), validation_1.default, authenticate);
    app.post('/users/forgot-password', (0, userValidators_1.validateUserForgetPassword)(), validation_1.default, forgotPassword);
    app.post('/users/check-reset', (0, userValidators_1.validateUserCheckReset)(), validation_1.default, checkResetCode);
    app.post('/users/reset-password', (0, userValidators_1.validateUserResetPassword)(), validation_1.default, resetPassword);
    app.get('/users/confirm/:token', confirmEmail);
};
exports.default = userRoutes;
