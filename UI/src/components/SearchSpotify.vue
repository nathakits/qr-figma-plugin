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
    <!-- type -->
    <hr class="divide-solid my-2">
    <div class="flex justify-between items-center px-4">
      <div class="flex space-x-1">
        <div class="flex-initial">
          <button
            class="text-xs px-2 py-1 focus:outline-none rounded h-8 font-semibold cursor-default"
            :class="activeSearchView === 'new-releases' ? 'text-gray-900': 'text-gray-400 hover:text-gray-700'"
            @click="activeSearchView = 'new-releases'"
          >
            New releases
          </button>
        </div>
        <div class="flex-initial">
          <button
            class="text-xs px-2 py-1 focus:outline-none rounded h-8 font-semibold cursor-default"
            :class="activeSearchView === 'artists' ? 'text-gray-900': 'text-gray-400 hover:text-gray-700'"
            @click="activeSearchView = 'artists', activeSearchArr = artists"
          >
            Artists
          </button>
        </div>
        <div class="flex-initial">
          <button 
            class="text-xs px-2 py-1 focus:outline-none rounded h-8 font-semibold cursor-default"
            :class="activeSearchView === 'tracks' ? 'text-gray-900': 'text-gray-400 hover:text-gray-700'"
            @click="activeSearchView = 'tracks', activeSearchArr = tracks"
          >
            Tracks
          </button>
        </div>
      </div>
      <template v-if="activeSearchView === 'tracks'">
        <button
          v-if="playing"
          @click="stopTrack()"
          class="text-xs px-2 py-1 focus:outline-none rounded h-8 cursor-default border-gray-900 text-gray-900 border"
        >
          Stop playing
        </button>
        <audio id="audioPlayer" src=""></audio>
      </template>
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
            <p v-if="activeSearchView === 'tracks'" class="text-xs pt-1 w-max">Double click on a thumbnail to preview track.</p>
          </div>
        </Icons>
      </template>
    </div>
    <hr class="divide-solid my-2">
    <!-- search results -->
    <div class="overflow-y-auto overflow-x-hidden" style="height: calc(100vh - 163px);">
      <template v-if="activeSearchView !== 'new-releases'">
        <div
          v-if="activeSearchArr.length !== 0"
          class="grid grid-cols-3 gap-4 px-4 pt-1"
        >
          <template v-for="(item ,i) in activeSearchArr">
            <div v-if="item !== null" :key="i" :id="item.name ? item.name : ''">
              <!-- artists -->
              <div
                v-if="activeSearchView === 'artists'"
                class="box rounded h-32 w-full relative"
                :class="item.images.length > 0 ? 'hover:opacity-50 cursor-pointer' : 'bg-green-700'"
              >
                <img
                  v-if="item.images.length > 0"
                  :id="item.id"
                  :src="item.images[1].url"
                  :alt="item.name"
                  loading=lazy
                  class="object-cover w-full h-full rounded"
                  @click="addToCanvas(item.images[0].url), addToSelection(item.name, item.images[0].url, item.id)"
                  v-longclick="() => setLongpress()"
                >
                <Icons v-else name="artist"/>
              </div>
              <!-- tracks -->
              <div
                v-else-if="activeSearchView === 'tracks'"
                class="box rounded h-32 w-full relative"
                :class="item.album.images.length > 0 ? 'hover:opacity-50 cursor-pointer' : 'bg-green-700'"
              >
                  <img
                    v-if="item.album.images.length > 0"
                    :id="item.id"
                    :src="item.album.images[1].url"
                    :alt="item.name"
                    loading=lazy
                    class="object-cover w-full h-full rounded "
                    @click="handleClick(item.album.images[0].url, item.preview_url), addToSelection(item.name, item.album.images[0].url, item.id)"
                    v-longclick="() => setLongpress()"
                  >
                  <Icons v-else name="track"/>
              </div>
              <div class="text-xs pt-1 font-semibold">{{ item.name }}</div>
              <p class="text-xs">
                <template v-for="(artist, i) in item.artists" class="text-xs">{{ i > 0 ? `, ${artist.name}` : artist.name }}</template>
              </p>
            </div>
          </template>
        </div>
        <div v-else class="flex justify-center items-center h-full">
          <div 
            class="text-center"
            style="max-width:240px"
          >
            <template v-if="activeSearchView === 'artists'">
              <h1 class="text-lg pb-2 font-semibold">Search Artists</h1>
              <p class="text-xs">Get Spotify Catalog information about artists that match a keyword string.</p>
            </template>
            <template v-if="activeSearchView === 'tracks'">
              <h1 class="text-lg pb-2 font-semibold">Search Tracks</h1>
              <p class="text-xs pb-1">Get Spotify Catalog information about tracks that match a keyword string and play track previews.</p>
            </template>
          </div>
        </div>
      </template>
      <template v-if="activeSearchView === 'new-releases'">
        <div class="grid grid-cols-3 gap-4 px-4 pt-1">
          <!-- new releases -->
          <div v-for="(item ,i) in newReleasesArr" :key="i" :id="item.name">
            <div class="box rounded h-32 w-full relative hover:opacity-50 cursor-pointer">
              <img
                v-if="item.images.length > 0"
                :id="item.id"
                :src="item.images[1].url"
                :alt="item.name"
                loading=lazy
                class="object-cover w-full h-full rounded"
                @click="addToCanvas(item.images[0].url), addToSelection(item.name, item.images[0].url, item.id)"
                v-longclick="() => setLongpress()"
              >
              <Icons v-else name="artist"/>
            </div>
            <div class="text-xs pt-1 pb-1 font-semibold">{{ item.name }}</div>
            <p class="text-xs">
              <template v-for="(artist, i) in item.artists" class="text-xs">{{ i > 0 ? `, ${artist.name}` : artist.name }}</template>
            </p>
          </div>
        </div>
      </template>
    </div>
    <!-- controls -->
    <div class="absolute bottom-0 left-0 right-0 bg-white">
      <hr class="divide-solid my-2">
      <div class="flex space-x-2 h-full px-4 pb-2 justify-end">
        <template v-if="activeSearchView !== 'new-releases'">
          <template v-if="longpress === false">
            <button
              v-if="activeSearchArr.length !== total"
              class="text-xs text-gray-900 border border-gray-900 py-1 px-4 rounded disabled:opacity-50 flex-initial h-8 cursor-default"
              @click="paginateSearch()"
              :disabled="activeSearchArr.length === 0"
            >
              Load More
            </button>
            <button
              class="text-xs text-gray-900 border border-gray-900 py-1 px-4 rounded disabled:opacity-50 flex-initial h-8 cursor-default"
              :class="activeSearchArr.length === 0 ? 'disabled:opacity-50' : ''"
              @click="clearSearch()"
              :disabled="activeSearchArr.length === 0"
            >
              Clear Search
            </button>
          </template>
          <template v-if="arraySel.length >= 0 && longpress === true">
            <button
              class="text-xs text-gray-900 border border-gray-900 py-1 px-4 rounded disabled:opacity-50 flex-initial h-8 cursor-default"
              @click="resetLongpress()"
              :disabled="activeSearchArr.length === 0"
            >
              Clear Selection ({{ arraySel.length }})
            </button>
            <button
              class="text-xs text-gray-900 border border-gray-900 py-1 px-4 rounded disabled:opacity-50 flex-initial h-8 cursor-default"
              @click="addSelectionToCanvas()"
              :disabled="arraySel.length === 0"
            >
              Insert
            </button>
          </template>
        </template>
        <template v-if="activeSearchView === 'new-releases'">
          <template>
            <button
              class="text-xs text-gray-900 border border-gray-900 py-1 px-4 rounded disabled:opacity-50 flex-initial h-8 cursor-default"
              :disabled="longpress === false"
              @click="resetLongpress()"
            >
              Clear Selection ({{ arraySel.length }})
            </button>
            <button
              class="text-xs text-gray-900 border border-gray-900 py-1 px-4 rounded disabled:opacity-50 flex-initial h-8 cursor-default"
              @click="addSelectionToCanvas()"
              :disabled="arraySel.length === 0"
            >
              Insert
            </button>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { notify, createImage, createImageArray } from "../helpers/figma-messages";
import Icons from "./Icons.vue";
import Menu from "./Menu.vue"

var qs = require('qs');
var data = qs.stringify({
 'grant_type': 'client_credentials' 
});

export default {
  name: "SearchSpotify",
  components: {Icons, Menu},
  data() {
    return {
      activeSearchView: 'new-releases',
      activeSearchArr: [],
      newReleasesArr: [],
      artists: [],
      tracks: [],
      searchType: 'artist,track',
      searchQuery: '',
      limit: 50,
      offset: 0,
      total: 0,
      size: {
        width: 800,
        height: 800
      },
      arraySel: [],
      longpress: false,
      playing: false,
      clickCounter: 0,
      timer: null,
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
    getNewReleases() {
      this.arraySel = []
      var auth = process.env.VUE_APP_SPOTIFY_AUTH_BASIC
      axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: data,
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      })
      .then( response => {
        axios({
          method: 'get',
          url: `https://api.spotify.com/v1/browse/new-releases?limit=30`,
          headers: {
            'Authorization': `Bearer ${response.data.access_token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        })
        .then( response => {
          let res = response.data
          this.newReleasesArr = res.albums.items
        })
      }).catch( error => {
        console.log(error)
        notify(error)
      });
    },
    querySpotify() {
      this.arraySel = []
      if (this.searchQuery.length !== 0) {
        var auth = process.env.VUE_APP_SPOTIFY_AUTH_BASIC
        axios({
          method: 'post',
          url: 'https://accounts.spotify.com/api/token',
          data: data,
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        })
        .then( response => {
          axios({
            method: 'get',
            url: `https://api.spotify.com/v1/search?q=${this.searchQuery.replace(' ', '+')}&type=${this.searchType}&offset=${this.offset}&limit=${this.limit}`,
            headers: {
              'Authorization': `Bearer ${response.data.access_token}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
          })
          .then( response => {
            let res = response.data
            this.artists = res.artists.items
            this.tracks = res.tracks.items
            this.total = res.artists.total

            if (this.activeSearchView === 'artists') {
               this.activeSearchArr = this.artists
            } else if (this.activeSearchView === 'tracks') {
              this.activeSearchArr = this.tracks
            }
          })
        }).catch( error => {
          console.log(error)
          notify(error)
        });
      }
    },
    paginateSearch() {
      if (this.searchQuery.length !== 0 && this.artists.length !== 0) {
        var auth = process.env.VUE_APP_SPOTIFY_AUTH_BASIC
        axios({
          method: 'post',
          url: 'https://accounts.spotify.com/api/token',
          data: data,
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        })
        .then( response => {
          axios({
            method: 'get',
            url: `https://api.spotify.com/v1/search?q=${this.searchQuery.replace(' ', '+')}&type=${this.searchType}&offset=${this.offset += 18}&limit=${this.limit}`,
            headers: {
              'Authorization': `Bearer ${response.data.access_token}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
          })
          .then( response => {
            let res = response.data
            this.artists = this.artists.concat(res.artists.items)
            this.tracks = this.tracks.concat(res.tracks.items)
            this.total = res.artists.total

            if (this.activeSearchView === 'artists') {
              this.activeSearchArr = this.artists
            } else {
              this.activeSearchArr = this.tracks
            }
          })
        }).catch( error => {
          console.log(error)
          notify(error)
        });
      }
    },
    clearSearch() {
      this.artists = []
      this.tracks = []
      this.activeSearchArr = []
      this.total = 0
      this.offset = 0
      this.searchQuery = ''
      var input = document.querySelector('input')
      input.focus()
    },
    handleClick(imageURL, trackURL) {
      this.clickCounter++
      if (this.clickCounter === 1) {
        this.timer = setTimeout(() => {
          this.clickCounter = 0
          this.addToCanvas(imageURL)
        }, 200);
      } else if (this.clickCounter === 2) {
        clearTimeout(this.timer)
        this.clickCounter = 0
        if (trackURL) {
          this.playTrack(trackURL)
        } else {
          notify(`Track not available`, {timeout: 1500})
        }
      }
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
    addToSelection(name, url, id) {
      if (this.longpress === true) {
        var obj = {
          id: id,
          name: name,
          url: url
        }
        // check for duplicate
        var dupObj = this.arraySel.find(obj => {
          return obj.id === id
        })

        if (dupObj) {
          // if already exists then remove from array
          var index = this.arraySel.indexOf(dupObj)
          this.arraySel.splice(index, 1)
          var clickObj = document.getElementById(id)
          clickObj.classList.remove('opacity-30')
          clickObj.parentElement.classList.remove('selected-blue')
        }
        else {
          // else add into array
          var select = document.getElementById(id)
          select.classList.add('opacity-30')
          select.parentElement.classList.add('selected-blue')
          this.arraySel.push(obj)
        }        
      }
    },
    addSelectionToCanvas() {
      var imgBufferArray = []
      var promises = []

      if (this.arraySel.length > 0) {
        this.arraySel.forEach( obj => {
          promises.push(
            axios({
              method: 'get',
              url: obj.url,
              responseType: 'arraybuffer'
            })
            .then( response => {
              var arrayBufferView = new Uint8Array( response.data )
              imgBufferArray.push(arrayBufferView)
            })
          )
        })
        Promise.all(promises).then(() => {
          createImageArray(imgBufferArray, this.size)
        })
      }
    },
    setLongpress() {
      this.longpress = true;
    },
    resetLongpress() {
      this.longpress = false
      // remove all opacity classes
      var borderArr = document.querySelectorAll('.selected-blue')
      borderArr.forEach(el => {
        el.classList.remove('selected-blue')
      })
      var opacityArr = document.querySelectorAll('.opacity-30')
      opacityArr.forEach(el => {
        el.classList.remove('opacity-30')
      })
      this.arraySel = []
    },
    playTrack(url) {
      clearTimeout(this.timer)
      var audio = document.getElementById('audioPlayer')
      audio.src = url
      if (audio.src) {
        var playPromise = audio.play()
        if (playPromise !== undefined) {
          playPromise.then(() => {
            this.playing = true
          }).catch((err) => {
            this.playing = false
            console.log(err)
          })
        }
        audio.onended = () => {
          this.playing = false
        }
      }
    },
    stopTrack() {
      var audio = document.getElementById('audioPlayer')
      audio.src = ''
      this.playing = false
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