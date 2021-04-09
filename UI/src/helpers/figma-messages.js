// All Figma Plugin Messages
const notify = (message, timeout) => {
  parent.postMessage({ pluginMessage: { type: 'msg', message, timeout } }, '*')
}

const createQRCodeVector = (svgPath, size) => {
  parent.postMessage({ pluginMessage: { type: 'create-qr-code-vector', svgPath, size } }, '*')
}

const createQRCodeRaster = (buffer, size) => {
  parent.postMessage({ pluginMessage: { type: 'create-qr-code-raster', buffer, size } }, '*')
}

export { notify, createQRCodeVector, createQRCodeRaster }