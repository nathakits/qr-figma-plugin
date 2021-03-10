<template>
  <div class="h-full">
    <!-- header -->
    <div class="flex items-center space-x-2 px-4">
      <Menu/>
      <div class="flex justify-between items-center flex-1">
        <!-- views -->
        <div class="flex flex-1 space-x-1">
          <div class="flex-initial">
            <button
              class="text-xs px-2 py-1 focus:outline-none rounded h-8 cursor-default "
              :class="activeView === 'raster' ? 'font-semibold text-gray-900' : 'text-gray-400' "
              @click="activeView = 'raster'"
            >
              Raster
            </button>
          </div>
          <div class="flex-initial">
            <button
              class="text-xs px-2 py-1 focus:outline-none rounded h-8 cursor-default"
              :class="activeView === 'vector' ? 'font-semibold text-gray-900' : 'text-gray-400' "
              @click="activeView = 'vector'"
            >
              Vector
            </button>
          </div>
        </div>
        <template>
          <Icons
            id="infoIcon"
            class="relative"
            name="info"
            @mouseover.native="tooltip = true"
            @mouseleave.native="tooltip = false"
          >
            <div
              v-show="tooltip"
              class="absolute bg-gray-900 text-white flex justify-center p-2 right-7 rounded z-50 flex-col shadow"
            >
              <p class="text-xs w-max">Long press to multi-select images.</p>
            </div>
          </Icons>
        </template>
      </div>
    </div>
    <hr class="divide-solid my-2">
    <div class="flex items-center space-x-2 px-4">
      <div class="flex-1">
        <div class="focus-within:text-gray-600 text-gray-400">
          <input
            id="searchField"
            type="text"
            class="text-xs px-4 py-1 border focus:ring-gray-500 focus:border-gray-900 hover:border-gray-900 w-full border-gray-300 rounded focus:outline-none text-gray-600 h-8"
            placeholder="Search"
            v-model="URLinput"
          >
        </div>
      </div>
      <button
          class="text-xs text-gray-900 border border-gray-900 py-1 px-4 rounded disabled:opacity-50 flex-initial h-8 cursor-default"
          :disabled="URLinput.length === 0"
        >
          Upload Image
        </button>
    </div>
    <hr class="divide-solid my-2">
    <!-- QR Code -->
    <div class="overflow-y-auto overflow-x-hidden" style="height: calc(100vh - 163px);">
      <div v-show="activeView === 'raster'" class="w-full h-full">
        <div id="canvas" class="flex justify-center items-center w-full h-full"></div>
      </div>
      <div v-show="activeView === 'vector'" class="w-full h-full">
        <div>vector</div>
      </div>
    </div>
    <!-- controls -->
    <div class="absolute bottom-0 left-0 right-0 bg-white">
      <hr class="divide-solid my-2">
      <div class="flex space-x-2 h-full px-4 pb-2 justify-between">
        <template v-if="activeView === 'raster'">
          <button
            class="text-xs text-gray-900 border border-gray-900 py-1 px-4 rounded disabled:opacity-50 flex-initial h-8 cursor-default"
            @click="copySVGToClipboard(svgDOM)"
            :disabled="URLinput.length === 0"
          >
            Clear
          </button>
          <button
            class="text-xs text-gray-900 border border-gray-900 py-1 px-4 rounded disabled:opacity-50 flex-initial h-8 cursor-default"
            @click="InsertQRCode()"
            :disabled="URLinput.length === 0"
          >
            Insert QR code
          </button>
        </template>
        <template v-else-if="activeView === 'vector'">
          <button
            class="text-xs text-gray-900 border border-gray-900 py-1 px-4 rounded disabled:opacity-50 flex-initial h-8 cursor-default"
            @click="copySVGToClipboard(svgDOM)"
            :disabled="URLinput.length === 0"
          >
            Copy SVG
          </button>
          <button
            class="text-xs text-gray-900 border border-gray-900 py-1 px-4 rounded disabled:opacity-50 flex-initial h-8 cursor-default"
            @click="InsertQRCode()"
            :disabled="URLinput.length === 0"
          >
            Insert QR code
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import QRCodeStyling from "qr-code-styling";
import Snap from "snapsvg-cjs";
import { notify, createQRCode } from "../helpers/figma-messages";
import Icons from "./Icons.vue";
import Menu from "./Menu.vue"

import { optimize } from 'svgo/dist/svgo.browser.js'

export default {
  name: "GenerateQr",
  components: {Icons, Menu},
  data() {
    return {
      activeView: 'raster',
      URLinput: 'https://figma.com',
      image: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg',
      svgPath: '',
      svgDOM: '',
      size: {
        width: 250,
        height: 250
      },
      tooltip: false
    };
  },
  watch: {
    URLinput() {
      let qrcode = this.generateQRCode()
      let canvas = document.getElementsByTagName('canvas')[0]
      if (canvas) {
        // replace existing canvas
        canvas.remove()
        qrcode.append(document.getElementById("canvas"))
        let svgString = qrcode._qr.createSvgTag()
        this.svgPath = this.transfromSVGtoDOM(svgString)
      } else {
        qrcode.append(document.getElementById("canvas"))
      }
    }
  },
  mounted() {
    let qrcode = this.generateQRCode()
    qrcode.append(document.getElementById("canvas"))
    // set svg for copying to clipboard
    let svgString = qrcode._qr.createSvgTag()
    this.svgPath = this.transfromSVGtoDOM(svgString)
  },
  methods: {
    generateQRCode() {
      var options = {
        width: this.size.width,
        height: this.size.height,
        data: this.URLinput,
        image: this.image,
        backgroundOptions: {
          color: "#ffffff",
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 20
        }
      }
      return new QRCodeStyling(options)
    },
    InsertQRCode() {
      if (this.svgPath) {
        createQRCode(this.svgPath, this.size)
      } else {
        notify('No SVG data')
      }
    },
    copySVGToClipboard(svg) {
      console.log(svg);
      navigator.clipboard.writeText(svg);
      notify(`SVG copied`)
    },
    optimzeSVG(svg) {
      return optimize(svg, {
        // optional but recommended field
        path: 'path-to.svg',
        // all config fields are also available here
        multipass: true
      })
    },
    transfromSVGtoDOM(string) {
      var parser = new DOMParser();
      var doc = parser.parseFromString(string, "image/svg+xml");
      var pathDOM = doc.querySelector('path')
      var path = pathDOM.getAttribute('d')
      var absolutePath = Snap.path.toAbsolute(path)
      var sanitizedPath = absolutePath
                            .toString()
                            .replace(/,/g, " ")
                            .replace(/(L)/g, " $1 ")
                            .replace(/(Z)/g, " $1 ")
                            .replace(/(M)/g, "$1 ")
                            .trim()
      return sanitizedPath
    },
  }
};
</script>

<style>
.bg-fblue:hover {
  background-color:#18a0fb;
}

.selected-blue {
  box-shadow: 0 0 0 2px #18a0fb;
}
</style>