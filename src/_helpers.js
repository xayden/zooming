const body = document.body
const docElm = document.documentElement
const trans = sniffTransition(document.createElement('div'))

function divide (denominator) {
  return (numerator) => {
    return numerator / denominator
  }
}

function toggleListener (el, type, handler, add) {
  if (add) {
    el.addEventListener(type, handler[type])
  } else {
    el.removeEventListener(type, handler[type])
  }
}

function sniffTransition (el) {
  let ret     = {}
  const trans = ['webkitTransition', 'transition', 'mozTransition']
  const tform = ['webkitTransform', 'transform', 'mozTransform']
  const end   = {
    'transition'       : 'transitionend',
    'mozTransition'    : 'transitionend',
    'webkitTransition' : 'webkitTransitionEnd'
  }

  trans.some(prop => {
    if (el.style[prop] !== undefined) {
      ret.transitionProp = prop
      ret.transEndEvent = end[prop]
      return true
    }
  })

  tform.some(prop => {
    if (el.style[prop] !== undefined) {
      ret.transformProp = prop
      ret.transformCssProp = prop.replace(/(.*)Transform/, '-$1-transform')
      return true
    }
  })

  return ret
}

function checkTrans (styles) {
  const transitionProp = trans.transitionProp
  const transformProp = trans.transformProp

  let value
  if (styles.transition) {
    value = styles.transition
    delete styles.transition
    styles[transitionProp] = value
  }
  if (styles.transform) {
    value = styles.transform
    delete styles.transform
    styles[transformProp] = value
  }
}

function isLink (el) {
  return el.tagName === 'A'
}

function isValidImage (filename) {
  return (/\.(gif|jpg|jpeg|png)$/i).test(filename)
}

export const webkitPrefix = 'WebkitAppearance' in docElm.style
  ? '-webkit-'
  : ''

export const cursor = {
  default: 'auto',
  zoomIn: `${webkitPrefix}zoom-in`,
  zoomOut: `${webkitPrefix}zoom-out`,
  grab: `${webkitPrefix}grab`,
  move: 'move'
}

export const half = divide(2)
export const transformCssProp = trans.transformCssProp
export const transEndEvent = trans.transEndEvent

export function loadImage (url, cb) {
  const img = new Image()
  img.onload = function () {
    if (cb) cb(img)
  }
  img.src = url
}

export function scrollTop () {
  return window.pageYOffset ||
    (docElm || body.parentNode || body).scrollTop
}

export function getWindowCenter () {
  const docWidth = docElm.clientWidth || body.clientWidth
  const docHeight = docElm.clientHeight || body.clientHeight

  return {
    x: half(docWidth),
    y: half(docHeight)
  }
}

export function toggleGrabListeners (el, handler, add) {
  ['mousedown', 'mousemove', 'mouseup','touchstart', 'touchmove', 'touchend']
  .forEach(type => {
    toggleListener(el, type, handler, add)
  })
}

export function setStyle (el, styles, remember) {
  checkTrans(styles)

  let s = el.style
  let original = {}

  for (let key in styles) {
    if (remember) original[key] = s[key] || ''
    s[key] = styles[key]
  }

  return original
}

export function bindAll (_this, that) {
  const methods = (
    Object.getOwnPropertyNames(
      Object.getPrototypeOf(_this)
    )
  )

  methods.forEach(method => {
    _this[method] = _this[method].bind(that)
  })
}

export function isImageLink (el) {
  return isLink(el) && isValidImage(el.getAttribute('href'))
}
