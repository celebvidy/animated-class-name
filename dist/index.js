'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AnimatedClassName = function (_React$Component) {
  _inherits(AnimatedClassName, _React$Component);

  function AnimatedClassName() {
    _classCallCheck(this, AnimatedClassName);

    return _possibleConstructorReturn(this, (AnimatedClassName.__proto__ || Object.getPrototypeOf(AnimatedClassName)).apply(this, arguments));
  }

  _createClass(AnimatedClassName, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          startClassName = _props.startClassName,
          className = _props.className,
          onComplete = _props.onComplete,
          timeout = _props.timeout;


      if (startClassName) {
        switchClassName(this, startClassName, className, { onComplete: onComplete, timeout: timeout });
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(_ref) {
      var className = _ref.className,
          forceUpdate = _ref.forceUpdate,
          onComplete = _ref.onComplete,
          timeout = _ref.timeout;

      var oldClassName = this.props.className;
      var willAnimate = className !== oldClassName; //other props changed, not animation related props

      if (willAnimate) {
        switchClassName(this, oldClassName, className, { onComplete: onComplete, timeout: timeout });
        //allow calling code to provide a hash for easy comparison || always update on animate (i.e. cuz children change at same time)
        return forceUpdate !== this.props.forceUpdate;
      }

      return true;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          _props2$className = _props2.className,
          className = _props2$className === undefined ? '' : _props2$className,
          _props2$startClassNam = _props2.startClassName,
          startClassName = _props2$startClassNam === undefined ? '' : _props2$startClassNam,
          forceUpdate = _props2.forceUpdate,
          onComplete = _props2.onComplete,
          timeout = _props2.timeout,
          _props2$constantClass = _props2.constantClassName,
          constantClassName = _props2$constantClass === undefined ? 'animated-class-name' : _props2$constantClass,
          props = _objectWithoutProperties(_props2, ['className', 'startClassName', 'forceUpdate', 'onComplete', 'timeout', 'constantClassName']);

      className = !this.mounted && startClassName ? startClassName : className;
      this.mounted = true;
      className = constantClassName + ' ' + className; //set components back to original RNW styles with display: flex, box-sizing: border-box, position: relative;

      return _react2.default.createElement('div', _extends({ className: className }, props));
    }
  }]);

  return AnimatedClassName;
}(_react2.default.Component);

exports.default = AnimatedClassName;


function switchClassName(component, oldClassName, className) {
  var _ref2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      onComplete = _ref2.onComplete,
      _ref2$timeout = _ref2.timeout,
      timeout = _ref2$timeout === undefined ? 0 : _ref2$timeout;

  setTimeoutAnimationFrame(function () {
    try {
      var element = _reactDom2.default.findDOMNode(component);
      var oldClasses = element.className; //preserve classes added by React internally
      element.className = oldClasses.replace(oldClassName, className); //switch classes without re-rendering
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('AnimatedClassName had the following issue switching classes: ' + e.toString());
      }
    }
  }, 1);

  if (onComplete) {
    setTimeoutAnimationFrame(onComplete, timeout + 1);
  }
}

function setTimeoutAnimationFrame(func) {
  var ms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  if (!func) return;

  setTimeout(function () {
    requestAnimationFrame(func);
  }, ms);
}