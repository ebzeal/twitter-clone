"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _routes = _interopRequireDefault(require("./api/routes"));

var app = (0, _express["default"])();
app.use((0, _cors["default"])());
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));

_dotenv["default"].config();

var port = process.env.PORT || 5000;
app.use('/api/v1', _routes["default"]);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, function () {
    console.log("Server started on port ".concat(port));
  });
}

var _default = app;
exports["default"] = _default;