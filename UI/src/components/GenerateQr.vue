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
              <p class="text-xs w-max">{{ tooltipMsg }}</p>
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
        :disabled="URLinput.length === 0 || activeView === 'vector'"
        @click="upload()"
      >
        Upload Image
      </button>
      <input
        style="display:none;"
        type="file"
        id="file-selector"
        accept=".jpg, .jpeg, .png"
      >
    </div>
    <hr class="divide-solid my-2">
    <!-- QR Code -->
    <div class="overflow-y-auto overflow-x-hidden" style="height: calc(100vh - 163px);">
      <div v-show="activeView === 'raster'" class="w-full h-full">
        <div id="canvasRaster" class="flex justify-center items-center w-full h-full"></div>
      </div>
      <div v-show="activeView === 'vector'" class="w-full h-full">
        <div class="flex justify-center items-center w-full h-full">
          <div id="divVector" :style="`height: ${size.height}px;width: ${size.width}px`"></div>
        </div>
      </div>
    </div>
    <!-- controls -->
    <div class="absolute bottom-0 left-0 right-0 bg-white">
      <hr class="divide-solid my-2">
      <div class="flex space-x-2 h-full px-4 pb-2 justify-between">
        <button
          class="text-xs text-gray-900 border border-gray-900 py-1 px-4 rounded disabled:opacity-50 flex-initial h-8 cursor-default"
          @click="reset()"
          :disabled="URLinput.length === 0"
        >
          Reset
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
import Snap from "snapsvg-cjs";
import { notify, createQRCodeVector } from "../helpers/figma-messages";
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
      image: '',
      svgPath: '',
      svgDOM: '',
      base64Image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAABBCAYAAACaYlekAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQLSURBVHgB7Zq/ThtBEMZn1uZPiCIdHeVFygNwT0AspUg60qVCoUkLVaQUEbhKF5kngC4p6ZLOfgN4g1wXujhEAmTsncwYn0BBys7dDeez5F+F0O76vpu53ZnvDmDOnDkPCUIBfm3GkfN+1yFuENE6/yvSzHvy7AUo6QPhKSCdgvcH2DlKISe5hE0E7fOkHShADmH/0mGBbRbY105QC2NRccP7Lv8ZQ0FKCBNSFtfSRs9pBkmkyooyIAbnurT7VpX2KmGSfjBdURkibk8zMJiKkxT8AQaUTMVbvF8NPW/BiLGoQhvFw+KC1xQUhojrUDeQnoeGBIVNzql6objZms1DtQtVTPCaNMLUh2KFBK8pLAy5tKkbRMFrCm8eRD2oG4qbHRQ2dO4A6gYXxqEhQWGrxylX2tSB2uA7mnpRVVKNGo02SRE6bYi4EIa2ZqhKmETNDwatqYoTUUQtbeuiEiasfj9LvXPJdNLSd/h3kzwNZ7EO+uVa3FhY2OFKe10qEzTvoImfaziFmx35IE+DmdGEAhwv/+y7FfjtODdJbg3p5m19xns3MupStDL0u4hug88WvlEQjUfxwh4hIsc3rYCwXBE73KSIBe0jFbMGtr7cChNBj0d+nwCDaxFi59JBu99Ce2vg8A3FDYRSXXQmbK1LsfPU5UjH6skI/Ixj66yFqWa4avOQSJUVlSGRyi1K4PEyT+ZrhuusAU4/MLIGJP1yi8rgeY882FgDkxQ0sQbev4OnbkSl17po4GroeQtbAwhm1kDD26y1olgnXN0D2HXQZLMWn53PQ2PC1gAaCgMbm0Fzs8ObB9lZA2RnMxhYA2hnDaCdzVDeGkCp2YzwYLMWKdbRRKwHRrBH2QMLTKyBRTCzBhadzVo0gPLWwPbR+CA06cFSPlQ5aqXWkoL47FW4XtRZA0tgZg0suOJrybzLc0NrQKLmCUysAYkaXWPutWS8zOu/RltrYPsrpn4JEjBIS0mlpQYm2rQc92N/MNGkYEYha2BcGHOziQ7Wx5WJ8hC/22hmrH2jGJtc++HYYshe1PdlS2dBvatzONBG6S6FhEUne9EAmrs8eYNuLybIRfKx0O8VIZfnIYKuobk/mHw1oLQ6poJa2PLJp3gAw2m/YFej2jwkUm6GRAkqYZJ+MEOihKAwSUECqOEL9v8TtgbgeuZECYpUrOFXAwrC1oCl51Ehs/rVQJAqvxqo9OsDTSpW1s5bovAVbb4acED1ErYII5N2fmS0jpagsH7S7nPUyrXzPP8qaadQIaqSagFG0o6nUAAWlS7dzK8UlTCJmodmC3K385QSjFoyHypGbQ1cJR/SRRgm2rSU9ONIJVWnYEahjlYKY6khPZdb99p53kWXeaOYRpTmzJlTHX8B6yqZXL8i284AAAAASUVORK5CYII=',
      size: {
        width: 250,
        height: 250
      },
      tooltip: false,
      qrcode: new QRCodeStyling(),
      tooltipMsg: 'To scan this code, use a QR Code scanner app on your phone or other camera apps.',
    };
  },
  mounted() {
    let qr = this.qrcode
    var options = {
      width: this.size.width,
      height: this.size.height,
      data: this.URLinput,
      image: this.base64Image,
      margin: 0,
      backgroundOptions: {
        color: "#ffffff",
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 10
      }
    }
    // update qr code with default options
    qr.update(options)
    // append svg for raster
    qr.append(document.getElementById("canvasRaster"))
    // set svg for vector
    this.setSVG(qr)
    console.log(`Raster set`);
    console.log(`Vector set`);
  },
  watch: {
    URLinput() {
      let qr = this.qrcode
      qr.update({data: this.URLinput})
      console.log(`QR Code data updated: ${this.URLinput}`);
      let vectorSVG = document.getElementsByTagName('svg')[2]
      if (vectorSVG) {
        // replace for vector
        vectorSVG.remove()
        this.setSVG(qr)
      }
    },
    base64Image() {
      let qr = this.qrcode
      qr.update({image: this.base64Image})
      console.log(`Image updated`);
    }
  },
  methods: {
    setSVG(qr) {
      let svgString = qr._qr.createSvgTag(10, 0)
      var parser = new DOMParser();
      var doc = parser.parseFromString(svgString, "image/svg+xml");
      var svgDOM = doc.querySelector('svg')
      svgDOM.setAttribute("height", "100%")
      svgDOM.setAttribute("width", "100%")
      let vectorDiv = document.getElementById("divVector")
      vectorDiv.appendChild(svgDOM)
      this.svgPath = this.transfromSVGtoDOM(svgString)
    },
    InsertQRCode() {
      if (this.svgPath) {
        createQRCodeVector(this.svgPath, this.size)
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
    // reset QR code data to default values
    reset() {
      if (this.activeView === 'raster') {
        this.URLinput = 'https://figma.com'
        this.base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAABBCAYAAACaYlekAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQLSURBVHgB7Zq/ThtBEMZn1uZPiCIdHeVFygNwT0AspUg60qVCoUkLVaQUEbhKF5kngC4p6ZLOfgN4g1wXujhEAmTsncwYn0BBys7dDeez5F+F0O76vpu53ZnvDmDOnDkPCUIBfm3GkfN+1yFuENE6/yvSzHvy7AUo6QPhKSCdgvcH2DlKISe5hE0E7fOkHShADmH/0mGBbRbY105QC2NRccP7Lv8ZQ0FKCBNSFtfSRs9pBkmkyooyIAbnurT7VpX2KmGSfjBdURkibk8zMJiKkxT8AQaUTMVbvF8NPW/BiLGoQhvFw+KC1xQUhojrUDeQnoeGBIVNzql6objZms1DtQtVTPCaNMLUh2KFBK8pLAy5tKkbRMFrCm8eRD2oG4qbHRQ2dO4A6gYXxqEhQWGrxylX2tSB2uA7mnpRVVKNGo02SRE6bYi4EIa2ZqhKmETNDwatqYoTUUQtbeuiEiasfj9LvXPJdNLSd/h3kzwNZ7EO+uVa3FhY2OFKe10qEzTvoImfaziFmx35IE+DmdGEAhwv/+y7FfjtODdJbg3p5m19xns3MupStDL0u4hug88WvlEQjUfxwh4hIsc3rYCwXBE73KSIBe0jFbMGtr7cChNBj0d+nwCDaxFi59JBu99Ce2vg8A3FDYRSXXQmbK1LsfPU5UjH6skI/Ixj66yFqWa4avOQSJUVlSGRyi1K4PEyT+ZrhuusAU4/MLIGJP1yi8rgeY882FgDkxQ0sQbev4OnbkSl17po4GroeQtbAwhm1kDD26y1olgnXN0D2HXQZLMWn53PQ2PC1gAaCgMbm0Fzs8ObB9lZA2RnMxhYA2hnDaCdzVDeGkCp2YzwYLMWKdbRRKwHRrBH2QMLTKyBRTCzBhadzVo0gPLWwPbR+CA06cFSPlQ5aqXWkoL47FW4XtRZA0tgZg0suOJrybzLc0NrQKLmCUysAYkaXWPutWS8zOu/RltrYPsrpn4JEjBIS0mlpQYm2rQc92N/MNGkYEYha2BcGHOziQ7Wx5WJ8hC/22hmrH2jGJtc++HYYshe1PdlS2dBvatzONBG6S6FhEUne9EAmrs8eYNuLybIRfKx0O8VIZfnIYKuobk/mHw1oLQ6poJa2PLJp3gAw2m/YFej2jwkUm6GRAkqYZJ+MEOihKAwSUECqOEL9v8TtgbgeuZECYpUrOFXAwrC1oCl51Ehs/rVQJAqvxqo9OsDTSpW1s5bovAVbb4acED1ErYII5N2fmS0jpagsH7S7nPUyrXzPP8qaadQIaqSagFG0o6nUAAWlS7dzK8UlTCJmodmC3K385QSjFoyHypGbQ1cJR/SRRgm2rSU9ONIJVWnYEahjlYKY6khPZdb99p53kWXeaOYRpTmzJlTHX8B6yqZXL8i284AAAAASUVORK5CYII='
      } else if (this.activeView === 'vector') {
        this.URLinput = 'https://figma.com'
      }
    },
    // update QR Code image
    upload() {
      const fileSelector = document.getElementById('file-selector')
      fileSelector.click()
      fileSelector.addEventListener('change', (event) => {
        const fileList = event.target.files;
        this.encodeImageFileAsURL(fileList)
        
      })
    },
    encodeImageFileAsURL(element) {
      var file = element[0]
      var reader = new FileReader();
      reader.onloadend = () => {
        this.base64Image = reader.result
      }
      reader.readAsDataURL(file);
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