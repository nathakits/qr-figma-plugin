// All Figma Plugin Messages
const notify = (message, timeout) => {
  parent.postMessage({ pluginMessage: { type: 'msg', message, timeout } }, '*')
}

const createQRCode = (svgPath, size) => {
  parent.postMessage({ pluginMessage: { type: 'create-qr-code', svgPath, size } }, '*')
}

export { notify, createQRCode }