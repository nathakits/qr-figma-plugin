<template>
  <div class="h-full">
    <!-- header -->
    <div class="flex items-center space-x-2 px-4">
      <Menu/>
      <div class="flex-1">
        <div class="relative focus-within:text-gray-600 text-gray-400">
          <input
            id="searchField"
            type="text"
            class="text-xs px-4 py-1 border focus:ring-gray-500 focus:border-gray-900 hover:border-gray-900 w-full border-gray-300 rounded focus:outline-none text-gray-600 h-8"
            placeholder="Search"
            v-model="URLinput"
          >
        </div>
      </div>
    </div>
    <!-- views -->
    <hr class="divide-solid my-2">
    <div class="flex justify-between items-center px-4">
      <div class="flex space-x-1">
        <div class="flex-initial">
          <button
            class="text-xs px-2 py-1 focus:outline-none rounded h-8 font-semibold cursor-default"
            @click="activeView = 'main'"
          >
            QR Code
          </button>
        </div>
        <div class="flex-initial">
          <button
            class="text-xs px-2 py-1 focus:outline-none rounded h-8 font-semibold cursor-default"
            @click="activeView = 'settings'"
          >
            Settings
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
    <hr class="divide-solid my-2">
    <!-- QR Code -->
    <div class="overflow-y-auto overflow-x-hidden" style="height: calc(100vh - 163px);">
      <div v-show="activeView === 'main'" class="w-full h-full">
        <div id="canvas" class="flex justify-center items-center w-full h-full"></div>
      </div>
      <div v-show="activeView === 'settings'" class="w-full h-full">
        <div>Setting</div>
      </div>
    </div>
    <!-- controls -->
    <div class="absolute bottom-0 left-0 right-0 bg-white">
      <hr class="divide-solid my-2">
      <div class="flex space-x-2 h-full px-4 pb-2 justify-end">
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
      </div>
    </div>
  </div>
</template>

<script>
import QRCodeStyling from "qr-code-styling";
import { notify, createQRCode } from "../helpers/figma-messages";
import Icons from "./Icons.vue";
import Menu from "./Menu.vue"

export default {
  name: "GenerateQr",
  components: {Icons, Menu},
  data() {
    return {
      activeView: 'main',
      URLinput: window.location.href,
      image: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg',
      svgPath: '',
      svgDOM: '',
      size: {
        width: 400,
        height: 400
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

        // get image blob

        // get svg path for inserting into
        // var parser = new DOMParser();
        // var doc = parser.parseFromString(svgString, "image/svg+xml");
        // var pathDOM = doc.querySelector('path')
        // var path = pathDOM.getAttribute('d')
        // this.svgPath = path
        // set svg for copying to clipboard
        let svgString = qrcode._qr.createSvgTag(12)
        this.svgDOM = svgString
      } else {
        qrcode.append(document.getElementById("canvas"))
      }
    }
  },
  mounted() {
    let qrcode = this.generateQRCode()
    qrcode.append(document.getElementById("canvas"))
    // set svg for copying to clipboard
    let svgString = qrcode._qr.createSvgTag(12)
    this.svgDOM = svgString
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
    copySVGToClipboard(svgDOM) {
      navigator.clipboard.writeText(svgDOM);
      notify(`SVG copied`)
    }
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