import React from 'react'
import ReactDOM from 'react-dom';


export default  class AnimatedClassName extends React.Component {
  componentDidMount() {
    let {startClassName, className, onComplete, timeout} = this.props;

    if(startClassName) {
      switchClassName(this, startClassName, className, {onComplete, timeout});
    }
  }

  shouldComponentUpdate({className, forceUpdate, onComplete, timeout}) {
    let oldClassName = this.props.className;
    let willAnimate = className !== oldClassName; //other props changed, not animation related props

    if(willAnimate) {
      switchClassName(this, oldClassName, className, {onComplete, timeout});
      //allow calling code to provide a hash for easy comparison || always update on animate (i.e. cuz children change at same time)
      return forceUpdate !== this.props.forceUpdate;
    }

    return true;
  }

  render() {
    let {
      className='', 
      startClassName='', 
      forceUpdate, 
      onComplete, 
      timeout,
      constantClassName='animated-class-name', 
      ...props
    } = this.props;

    className = !this.mounted && startClassName ? startClassName : className;
    this.mounted = true;
    className = `${constantClassName} ${className}`; //set components back to original RNW styles with display: flex, box-sizing: border-box, position: relative;

    return <div className={className} {...props} />;
  }
}

function switchClassName(component, oldClassName, className, {onComplete, timeout=0}={}) {
  setTimeoutAnimationFrame(() => {
    try {
      let element = ReactDOM.findDOMNode(component);
      let oldClasses = element.className; //preserve classes added by React internally
      element.className = oldClasses.replace(oldClassName, className); //switch classes without re-rendering
    }
    catch(e) {
      if(process.env.NODE_ENV !== 'production') {
        console.warn(`AnimatedClassName had the following issue switching classes: ${e.toString()}`)
      }
    }
  }, 1);

  if(onComplete) {
    setTimeoutAnimationFrame(onComplete, timeout+1);
  }
}

function setTimeoutAnimationFrame(func, ms=0) {
  if(!func) return;

  setTimeout(() => {
    requestAnimationFrame(func);
  }, ms);
}
