// This plugin enables users to generate and insert QR codes from URLs into Figma

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// functions
// resize vector with padding relative to frame dimension
let resizeVector = (msg, node, vector) => {
  let scale = node.width / msg.size.width
  let padding = msg.padding * scale
  let width = node.width - (padding * 2)
  let height = node.height - (padding * 2)
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
  vector.resize(width, height)
  vector.strokes = []
  vector.x = padding
  vector.y = padding
  vector.constraints = {
    horizontal: "SCALE",
    vertical: "SCALE"
  }
};


// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 350, height: 450 });

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
      let padding = msg.padding
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
      vector.constraints = {
        horizontal: "SCALE",
        vertical: "SCALE"
      }
      figma.currentPage.appendChild(frame);
    }
    else {
      // delete current vector and replace with new one
      currentSel.forEach(node => {
        if (node.type === 'FRAME') {
          node.fills = [
            {
              type: 'SOLID',
              color: {
                r: 1,
                g: 1,
                b: 1
              }
            }
          ]
          node.name = 'QR Code'
          // if node has no children
          if (node.children.length === 0) {
            // create and append new vector
            let vector = figma.createVector()
            node.appendChild(vector)
            resizeVector(msg, node, vector)
          }
          // if node has child with type vector
          else if (node.children.length === 1) {
            if (node.children[0].type === 'VECTOR') {
              // replace vector with new QR code
              let vector = node.children[0]
              resizeVector(msg, node, vector)
            } else {
              figma.notify(`Select a Frame with a vector child`)
            }
          }
        }
        else {
          figma.notify(`Please select a Frame`)
        }
      });
    }
  }
  // press insert and triggers this function
  if (msg.type === 'create-qr-code-raster') {
    // get the current selection in Figma
    var currentSel = figma.currentPage.selection
    var padding = msg.padding
    // if no selection
    if (currentSel.length === 0) {
      // get image uint8array from canvas
      var buffer = msg.buffer
      // convert uint8array to hash
      var hash = figma.createImage(buffer).hash
      // get center viewport coordinates
      var viewport = figma.viewport.center
      // create a new rectangle
      const rect = figma.createRectangle();
      // set x and y viewport coordinates to the rectangle
      rect.x = viewport.x
      rect.y = viewport.y
      rect.resize(msg.size.width + (padding * 2), msg.size.height + (padding * 2))
      // set type to IMAGE and set fill with image hash data
      rect.fills = [
        { 
          type: 'IMAGE',
          scaleMode: 'FILL',
          imageHash: hash
        }
      ];
      // add image to Figma
      figma.currentPage.appendChild(rect);
    }
    // else replace old raster with new data
    else {
      // loop nodes to check type
      currentSel.forEach(node => {
        if (
          node.type === 'FRAME' ||
          node.type === 'ELLIPSE' ||
          node.type === 'POLYGON' ||
          node.type === 'RECTANGLE' ||
          node.type === 'STAR' ||
          node.type === 'VECTOR'
        ) {
          // insert fill to node
          var buffer = msg.buffer
          var hash = figma.createImage(buffer).hash
          node.fills = [
            { type: 'IMAGE', scaleMode: 'FILL', imageHash: hash }
          ];
        }
        else {
          figma.notify(`Please select a fillable object`)
        }
      });
    }
  }

  if (msg.type === 'msg') {
    figma.notify(msg.message, msg.timeout)
  }
};
