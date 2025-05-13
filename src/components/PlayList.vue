<template>
  <div class="playlist-container">
    <div class="playlist-header">
      <h2>播放列表</h2>
      <span class="song-count">{{ songs.length }} 首歌曲</span>
    </div>
    
    <div class="song-list">
      <div 
        v-for="(song, index) in songs" 
        :key="index" 
        class="song-item"
        :class="{ active: currentIndex === index }"
        @click="selectSong(index)"
      >
        <div class="song-number">{{ index + 1 }}</div>
        <div class="song-info">
          <div class="song-title">{{ song.title }}</div>
          <div class="song-artist">{{ song.artist }}</div>
        </div>
        <div class="song-duration">{{ song.duration || '--:--' }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  props: {
    songs: {
      type: Array,
      default: () => []
    },
    currentSong: {
      type: Object,
      default: null
    }
  },
  emits: ['select-song'],
  setup(props, { emit }) {
    const currentIndex = computed(() => {
      return props.songs.findIndex(song => song.path === props.currentSong?.path)
    })

    const selectSong = (index) => {
      emit('select-song', index)
    }

    return {
      currentIndex,
      selectSong
    }
  }
}
</script>

<style scoped>
.playlist-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #181818;
}

.playlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #333;
}

.playlist-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.song-count {
  color: #b3b3b3;
  font-size: 0.9rem;
}

.song-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.song-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.song-item:hover {
  background-color: #282828;
}

.song-item.active {
  background-color: rgba(30, 215, 96, 0.1);
}

.song-number {
  width: 30px;
  text-align: center;
  color: #b3b3b3;
}

.song-item.active .song-number {
  color: #1ed760;
}

.song-info {
  flex: 1;
  margin: 0 15px;
  overflow: hidden;
}

.song-title {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-artist {
  font-size: 0.8rem;
  color: #b3b3b3;
}

.song-duration {
  color: #b3b3b3;
  font-size: 0.9rem;
}
</style>
