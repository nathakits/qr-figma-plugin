// This plugin enables users to search for artists and tracks
// and insert images for design using the Spotify API. 

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 400, height: 500 });

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'create-qr-code-vector') {
    // get current selection
    var currentSel = figma.currentPage.selection
    if (currentSel.length === 0) {
      // insert fill to node
      let frame = figma.createFrame()
      let vector = figma.createVector()
      let viewport = figma.viewport.center
      let padding = 16
      // set frame
      frame.fills = [
        {
          type: 'SOLID',
          color: {
            r: 1,
            g: 1,
            b: 1
          }
        }
      ]
      frame.name = 'QR Code'
      frame.resize(msg.size.width + (padding * 2), msg.size.height + (padding * 2))
      frame.x = viewport.x
      frame.y = viewport.y
      frame.appendChild(vector)
      // set vector
      vector.vectorPaths = [
        {
          windingRule: "NONZERO",
          data: msg.svgPath
        }
      ]
      vector.fills = [
        {
          type: 'SOLID',
          color: {
            r: 0,
            g: 0,
            b: 0
          }
        }
      ]
      vector.resize(msg.size.width, msg.size.height)
      vector.strokes = []
      vector.x = padding
      vector.y = padding
      figma.currentPage.appendChild(frame);
    }
    // else create a new rectangle and add to page
    else {
      currentSel = []
    }
  }

  if (msg.type === 'create-qr-code-raster') {
    var currentSel = figma.currentPage.selection
    if (currentSel.length === 0) {
      // image
      var buffer = msg.buffer
      console.log(buffer)
      var hash = figma.createImage(buffer).hash
      // viewport
      var viewport = figma.viewport.center
      // create rectangle and set image fill
      const rect = figma.createRectangle();
      // set x and y coordinates with viewport values
      rect.x = viewport.x
      rect.y = viewport.y
      rect.resize(msg.size.width, msg.size.height)
      // set type to IMAGE and set fill with image hash data
      rect.fills = [
        { type: 'IMAGE', scaleMode: 'FILL', imageHash: hash }
      ];
      // add image to Figma
      figma.currentPage.appendChild(rect);
    }
    else {
      currentSel = []
    }
  }

  if (msg.type === 'msg') {
    figma.notify(msg.message, msg.timeout)
  }
};
