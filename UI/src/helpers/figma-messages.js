// All Figma Plugin Messages
const notify = (message, timeout) => {
  parent.postMessage({
    pluginMessage: { 
      type: 'msg',
      message,
      timeout
    }
  }, '*')
}

const createQRCodeVector = (svgPath, size, padding) => {
  parent.postMessage({
    pluginMessage: {
      type: 'create-qr-code-vector',
      svgPath,
      size,
      padding
    }
  }, '*')
}

const createQRCodeRaster = (buffer, size, padding) => {
  parent.postMessage({
    pluginMessage: {
      type: 'create-qr-code-raster',
      buffer,
      size,
      padding
    }
  }, '*')
}

export { notify, createQRCodeVector, createQRCodeRaster }