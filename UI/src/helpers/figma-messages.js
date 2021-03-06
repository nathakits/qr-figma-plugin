// All Figma Plugin Messages

const createRectangles = (count) => {
  parent.postMessage({ pluginMessage: { type: 'create-rectangles', count } }, '*')
}

const closePlugin = () => {
  parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
}

const notify = (message, timeout) => {
  parent.postMessage({ pluginMessage: { type: 'msg', message, timeout } }, '*')
}

const createImage = (buffer, size) => {
  parent.postMessage({ pluginMessage: { type: 'create-image', buffer, size } }, '*')
}

const createImageArray = (array, size) => {
  parent.postMessage({ pluginMessage: { type: 'create-image-array', array, size } }, '*')
}

export { createRectangles, closePlugin, notify, createImage, createImageArray }