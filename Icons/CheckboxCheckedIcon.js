'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _SvgIcon = require('./../SvgIcon');

var _SvgIcon2 = _interopRequireDefault(_SvgIcon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CheckboxCheckedIcon = function CheckboxCheckedIcon(props) {
    return _react2.default.createElement(
        _SvgIcon2.default,
        props,
        _react2.default.createElement('path', { d: 'M5.6,10.1c-0.1,0-0.2-0.1-0.3-0.2L2.2,7.1C2,6.9,1.9,6.5,2.1,6.3c0.2-0.3,0.6-0.3,0.8-0.1l2.6,2.4L9,2.4\r C9.1,2.2,9.4,2,9.7,2.2C10,2.4,10.1,2.7,9.9,3L6.1,9.9C6,10,5.9,10.1,5.6,10.1C5.7,10.1,5.6,10.1,5.6,10.1z' }),
        _react2.default.createElement('path', { d: 'M9.5,11.5h-7c-1.1,0-2-0.9-2-2v-7c0-1.1,0.9-2,2-2h7c1.1,0,2,0.9,2,2v7C11.5,10.6,10.6,11.5,9.5,11.5z' })
    );
};
CheckboxCheckedIcon.displayName = 'CheckboxCheckedIcon';
exports.default = CheckboxCheckedIcon;