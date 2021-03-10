// All Figma Plugin Messages
const notify = (message, timeout) => {
  parent.postMessage({ pluginMessage: { type: 'msg', message, timeout } }, '*')
}

const createQRCodeVector = (svgPath, size) => {
  parent.postMessage({ pluginMessage: { type: 'create-qr-code-vector', svgPath, size } }, '*')
}

export { notify, createQRCodeVector }