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
            v-model="searchQuery"
          >
        </div>
      </div>
      <div>
        <button
          class="text-xs bg-blue-600 text-white border border-blue-600 py-1 px-4 rounded disabled:opacity-50 h-8 cursor-default"
          :class="searchQuery.length !== 0 ? 'hover:bg-blue-700' : 'cursor-default'"
          @click="querySpotify()"
          :disabled="searchQuery.length === 0"
        >
          Search
        </button>
      </div>
    </div>
    <!-- views -->
    <hr class="divide-solid my-2">
    <div class="flex justify-between items-center px-4">
      <div class="flex space-x-1">
        <div class="flex-initial">
          <button
            class="text-xs px-2 py-1 focus:outline-none rounded h-8 font-semibold cursor-default"
            @click="activeView === 'main'"
          >
            QR Code
          </button>
        </div>
        <div class="flex-initial">
          <button
            class="text-xs px-2 py-1 focus:outline-none rounded h-8 font-semibold cursor-default"
            @click="activeView === 'settings'"
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
      <template v-if="activeView === 'main'">
        <div>QR Code</div>
      </template>
      <template v-else-if="activeView === 'settings'">
        <div>Setting</div>
      </template>
    </div>
    <!-- controls -->
    <div class="absolute bottom-0 left-0 right-0 bg-white">
      <hr class="divide-solid my-2">
      <div class="flex space-x-2 h-full px-4 pb-2 justify-end">
        <button
          class="text-xs text-gray-900 border border-gray-900 py-1 px-4 rounded disabled:opacity-50 flex-initial h-8 cursor-default"
          @click="clearInput()"
          :disabled="URLinput.length === 0"
        >
          Clear
        </button>
        <button
          class="text-xs text-gray-900 border border-gray-900 py-1 px-4 rounded disabled:opacity-50 flex-initial h-8 cursor-default"
          @click="addToCanvas()"
          :disabled="URLinput.length === 0"
        >
          Insert
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { notify, createImage, createImageArray } from "../helpers/figma-messages";
import Icons from "./Icons.vue";
import Menu from "./Menu.vue"

export default {
  name: "GenerateQr",
  components: {Icons, Menu},
  data() {
    return {
      activeView: 'main',
      URLinput: '',
      size: {
        width: 800,
        height: 800
      },
      tooltip: false
    };
  },
  mounted() {
    this.getNewReleases()
  },
  watch: {
    activeSearchView() {
      // when tab changes
      // reset and exit selection mode
      this.resetLongpress()
    }
  },
  methods: {
    clearInput() {
      this.URLinput = ''
      // var input = document.querySelector('input')
      // input.focus()
    },
    addToCanvas(imageURL) {
      if (this.longpress === false) {
        axios({
          method: 'get',
          url: imageURL,
          responseType: 'arraybuffer'
        })
        .then( response => {
          var arrayBufferView = new Uint8Array( response.data );
          // send data to figma
          createImage(arrayBufferView, this.size)
        })
      }
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