<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h1>音乐播放器</h1>
    </div>
    
    <div class="sidebar-content">
      <div class="sidebar-section">
        <h3>库</h3>
        <ul>
          <li>
            <button class="sidebar-btn" @click="openFolder">
              <i class="fas fa-folder-open"></i>
              <span>打开文件夹</span>
            </button>
          </li>
          <li>
            <button class="sidebar-btn">
              <i class="fas fa-music"></i>
              <span>最近播放</span>
            </button>
          </li>
        </ul>
      </div>
      
      <div class="sidebar-section">
        <h3>播放列表</h3>
        <ul>
          <li v-for="(playlist, index) in playlists" :key="index">
            <button class="sidebar-btn">
              <i class="fas fa-list"></i>
              <span>{{ playlist.name }}</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      playlists: [
        { name: '我的最爱', id: 1 },
        { name: '工作音乐', id: 2 },
        { name: '放松时光', id: 3 }
      ]
    }
  },
  methods: {
    async openFolder() {
      try {
        const folderPath = await window.electronAPI.openDirectoryDialog()
        console.log('56', folderPath)
        this.$emit('folder-selected', folderPath)
      } catch (error) {
        console.error('Error opening folder:', error)
      }
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 240px;
  height: 100%;
  background-color: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  padding: 20px 0;
  user-select: none;
}

.sidebar-header {
  padding: 0 20px 20px;
  border-bottom: 1px solid #282828;
}

.sidebar-header h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #1ed760;
  font-weight: 700;
  letter-spacing: 1px;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 0;
  scrollbar-width: thin;
  scrollbar-color: #535353 transparent;
}

.sidebar-content::-webkit-scrollbar {
  width: 8px;
}

.sidebar-content::-webkit-scrollbar-thumb {
  background-color: #535353;
  border-radius: 4px;
}

.sidebar-section {
  margin-bottom: 20px;
}

.sidebar-section h3 {
  padding: 0 20px;
  margin: 0 0 10px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #b3b3b3;
}

.sidebar-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-section li {
  margin: 2px 0;
}

.sidebar-btn {
  width: 100%;
  padding: 10px 20px;
  background: transparent;
  border: none;
  color: #fff;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 0;
}

.sidebar-btn:hover {
  background: #282828;
  color: #1ed760;
}

.sidebar-btn i {
  font-size: 1rem;
  width: 20px;
  text-align: center;
}

.sidebar-btn.active {
  background: #282828;
  color: #1ed760;
  font-weight: 600;
}

.sidebar-btn.active i {
  color: #1ed760;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .sidebar {
    width: 180px;
    padding: 10px 0;
  }
  
  .sidebar-header h1 {
    font-size: 1.2rem;
  }
  
  .sidebar-btn {
    padding: 8px 15px;
    font-size: 0.8rem;
  }
}
</style>
