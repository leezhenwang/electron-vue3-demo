<template>
  <div class="app-container">
    <Sidebar @folder-selected="handleFolderSelect" />
    <div class="main-content">
      <Playlist :songs="playlist" @select-song="setCurrentSong" />
      <Player 
        :current-song="currentSong" 
        :is-playing="isPlaying"
        @play-pause="togglePlay"
        @next="playNext"
        @prev="playPrev"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, nextTick, onMounted } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Player from './components/Player.vue'
import Playlist from './components/Playlist.vue'

export default {
  components: { Sidebar, Player, Playlist },
  setup() {
    const playlist = ref([])
    const currentSongIndex = ref(-1)
    const isPlaying = ref(false)
    playlist.value = JSON.parse(localStorage.getItem('playlist')) || []
  
    const currentSong = computed(() => {
      return playlist.value[currentSongIndex.value] || null
    })
    
    const handleFolderSelect = async (folderPath) => {
      console.log(35, folderPath)
      try {
        const files = await window.electronAPI.readFolder(folderPath)
        playlist.value = files
          .filter(file => ['.mp3', '.wav', '.flac'].some(ext => file.endsWith(ext)))
          .map(file => ({
            path: file,
            title: file.split('/').pop().replace(/\.[^/.]+$/, ''),
            artist: 'Unknown Artist'
          }))
        localStorage.setItem('playlist', JSON.stringify(playlist.value))
        if (playlist.value.length > 0) {
          currentSongIndex.value = 0
        }
      } catch (error) {
        console.error('Error loading folder:', error)
      }
    }
    
    const setCurrentSong = (index) => {
      currentSongIndex.value = index
      isPlaying.value = true
    }

    const togglePlay = () => {
      isPlaying.value = !isPlaying.value
    }
    
    const playNext = () => {
      if (currentSongIndex.value < playlist.value.length - 1) {
        currentSongIndex.value++
      }
      isPlaying.value = false
      nextTick(() =>{togglePlay()})
    }
    
    const playPrev = () => {
      if (currentSongIndex.value > 0) {
        currentSongIndex.value--
      }
      isPlaying.value = false
      nextTick(() =>{togglePlay()})
    }
    return {
      playlist,
      currentSong,
      isPlaying,
      handleFolderSelect,
      setCurrentSong,
      togglePlay,
      playNext,
      playPrev,
    }
  }
}
</script>

<style lang="scss">
@import './assets/styles/main.scss';

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: $dark-bg;
}
</style>
