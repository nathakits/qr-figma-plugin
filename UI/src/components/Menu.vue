<template>
   <div class="relative">
    <button
      id="menuBtn"
      class="text-xs text-gray-900 hover:bg-gray-200 py-1 px-4 rounded disabled:opacity-50 h-8 focus:outline-none cursor-default"
      @click="menu = !menu"
    >
      <Icons name="menu"/>
    </button>
    <div v-show="menu" class="absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-gray-900 shadow-md z-50">
      <div id="menuList" class="py-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
        <template v-for="(item, i) in menuItems">
          <hr v-if="item.name ==='divider'" :key="i" class="my-2 opacity-30">
          <a
            v-else
            :key="i"
            :href="item.url"
            class="block px-4 py-1 text-xs text-white menuItem"
            :class="!item.url ? 'cursor-default' : 'bg-fblue'"
            role="menuitem"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div v-if="item.name === 'GitHub Repo'" class="flex justify-between">
              <span>{{ item.name }}</span>
              <span>{{ version }}</span>
            </div>
            <template v-else>{{ item.name }}</template>
          </a>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Icons from "./Icons.vue"
var pluginVersion = require('../../package.json').version

export default {
  components: {Icons},
  data() {
    return {
      menu: false,
      version: `V${pluginVersion}`,
      menuItems: [
        {
          name: 'GitHub Repo',
          url: 'https://github.com/nathakits/spottie-figma-plugin'
        },
        {
          name: 'divider',
          url: false
        },
        {
          name: 'Patreon',
          url: 'https://www.patreon.com/nathakits'
        },
        {
          name: 'Buy me a coffee',
          url: 'https://ko-fi.com/nathakits'
        },
        {
          name: 'divider',
          url: false
        },
        {
          name: 'By Nathakit Sae-Tan',
          url: 'https://nathakits.com'
        },
        {
          name: 'Support: nathakit.tan@gmail.com',
          url: 'mailto:nathakit.tan@gmail.com'
        }
      ],
    }
  },
  mounted(){
    document.addEventListener('mouseup', this.closeMenu)
  },
  beforeDestroy() {
    document.removeEventListener('mouseup', this.closeMenu)
  },
  methods: {
    closeMenu(e) {
      var menubtn = document.getElementById('menuBtn');
      var menu = document.getElementById('menuList');
      var isClickInside = menu.contains(e.target);
      var isMenuBtn = menubtn.contains(e.target)
      if (!isClickInside && !isMenuBtn) {
        this.menu = false
      } else {
        if (e.target.href) {
          this.menu = false
        }
      }
    },
  }
}
</script>