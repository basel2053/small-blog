'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const cors_1 = __importDefault(require('cors'));
const cookie_parser_1 = __importDefault(require('cookie-parser'));
const swagger_ui_express_1 = __importDefault(require('swagger-ui-express'));
const dotenv_1 = __importDefault(require('dotenv'));
const morgan_1 = __importDefault(require('morgan'));
const swagger_json_1 = __importDefault(require('../swagger.json'));
const ApiError_1 = __importDefault(require('./Error/ApiError'));
const user_1 = __importDefault(require('./handler/user'));
const post_1 = __importDefault(require('./handler/post'));
const comment_1 = __importDefault(require('./handler/comment'));
const refreshToken_1 = __importDefault(require('./handler/refreshToken'));
const oauth2_1 = __importDefault(require('./handler/oauth2'));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(
  (0, cors_1.default)({
    credentials: true,
    origin: 'https://small-blog-react.vercel.app/',
  })
);
app.use((0, morgan_1.default)('dev'));
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static('uploads'));
app.use(
  '/api-docs',
  swagger_ui_express_1.default.serve,
  swagger_ui_express_1.default.setup(swagger_json_1.default)
);
(0, user_1.default)(app);
(0, post_1.default)(app);
(0, comment_1.default)(app);
(0, refreshToken_1.default)(app);
(0, oauth2_1.default)(app);
app.all('*', (req, res, next) => {
  next(
    new ApiError_1.default(
      `Couldn't find such a route visit ${req.baseUrl}/api-docs to get more info`,
      404,
      "this route couldn't be found",
      true
    )
  );
});
app.use((error, req, res, next) => {
  const message = error.name;
  res.status(error.statusCode).json({ error: message });
});
app.listen(port, () => {
  console.log(`server is running up on http://localhost:${port}`);
});
exports.default = app;
