<template>
  <div class="player-container">
    <div class="song-info">
      <img v-if="currentSong" :src="currentSong.cover" class="album-art" />
      <div class="song-details">
        <h3>{{ currentSong?.title || "No song selected" }}</h3>
        <p>{{ currentSong?.artist || "Unknown Artist" }}</p>
      </div>
    </div>

    <div class="player-controls">
      <div class="controls-container">
        <button class="btn-icon" @click="$emit('prev')">
          <i class="fas fa-step-backward">上一首</i>
        </button>
        <button class="play-btn" @click="$emit('play-pause')">
          <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"
            >{{ isPlaying ? "暂停" : "播放" }}
          </i>
        </button>
        <button class="btn-icon" @click="$emit('next')">
          <i class="fas fa-step-forward">下一首</i>
        </button>
      </div>
      <div class="progress-container">
        <span class="time">{{ currentTime }}</span>
        <div class="progress-bar">
          <div
            class="progress-bar-fill"
            :style="{ width: progress + '%' }"
          ></div>
        </div>
        <span class="time">{{ duration }}</span>
      </div>
    </div>
    <div class="volume-control">
      <i>音量</i>
      <input 
        type="range" 
        v-model="volume"
        min="0"
        max="1"
        step="0.01"
        @input="updateVolume"
        class="volume-slider"
      >
      <span class="volume-percent">{{ Math.round(volume * 100) }}%</span>
    </div>
  </div>
</template>

<script>
import { ref, watch, computed } from "vue";
import { Howl } from "howler";

export default {
  components: {  },
  props: {
    currentSong: Object,
    isPlaying: Boolean,
  },
  setup(props, { emit }) {
    const sound = ref(null);
    const progress = ref(0);
    const currentTime = ref("0:00");
    const duration = ref("0:00");
    const volume = ref(0.25); // 默认音量
    const updateVolume = () => {
      sound.value.volume(volume.value);
      // emit("updat-volume", volume.value);
    }

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    watch(
      () => props.currentSong,
      (newSong) => {
        if (sound.value) {
          sound.value.unload();
        }

        if (newSong) {
          sound.value = new Howl({
            src: [newSong.path],
            html5: true,
            volume: volume.value,
            onplay: () => emit("update:isPlaying", true),
            onpause: () => emit("update:isPlaying", false),
            onend: () => emit("next"),
            onload: () => {
              duration.value = formatTime(sound.value.duration());
            },
          });

          const updateProgress = () => {
            if (sound.value) {
              progress.value =
                (sound.value.seek() / sound.value.duration()) * 100;
              currentTime.value = formatTime(sound.value.seek());
              requestAnimationFrame(updateProgress);
            }
          };

          requestAnimationFrame(updateProgress);
        }
      }
    );

    watch(
      () => props.isPlaying,
      (playing) => {
        if (!sound.value) return;

        if (playing) {
          sound.value.play();
        } else {
          sound.value.pause();
        }
      }
    );

    return {
      progress,
      currentTime,
      duration,
      formatTime,
      volume,
      updateVolume,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/main.scss";

.player-container {
  display: flex;
  flex-wrap: wrap;
  height: 100px;
  background: linear-gradient(to bottom, #1a1a2e, #16213e);
  color: #e6e6e6;
  font-family: "Segoe UI", sans-serif;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

  .song-info {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
    .song-details {
      h3 {
        font-size: 16px;
        margin: 0;
      }
    }
    .song-title {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 0.2rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .song-artist {
      font-size: 0.9rem;
      opacity: 0.8;
    }
  }

  .player-controls {
    display: flex;
    flex: 2;
    flex-direction: column;
    align-items: center;
    .controls-container{
      display: flex;
    }

    button {
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      transition: all 0.2s ease;
      padding: 0.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      &.play-pause {
        background: rgba(255, 255, 255, 0.2);
        width: 3rem;
        height: 3rem;

        &:hover {
          transform: scale(1.05);
        }
      }
    }
    .progress-container {
      padding: 0 1.5rem;
      margin: 1rem 0;
      display: flex;
      width: 100%;
      align-items: center;

      .progress-bar {
        flex: 1;
        height: 4px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
        cursor: pointer;
        position: relative;
        margin: 0 1rem;

        .progress {
          height: 100%;
          background: #00b4d8;
          border-radius: 2px;
          position: relative;

          &::after {
            content: "";
            position: absolute;
            right: -6px;
            top: 50%;
            transform: translateY(-50%);
            width: 12px;
            height: 12px;
            background: white;
            border-radius: 50%;
            opacity: 0;
            transition: opacity 0.2s;
          }
        }

        &:hover .progress::after {
          opacity: 1;
        }
      }

      .time-display {
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
        margin-top: 0.5rem;
        opacity: 0.7;
      }
    }
  }

  .visualizer-container {
    flex: 1;
    min-height: 120px;
    position: relative;
    margin: 0 1rem;
    border-radius: 8px;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.2);
  }

  .volume-control {
    display: flex;
    align-items: center;
    padding: 0 1.5rem 1rem;
    gap: 0.5rem;

    input[type="range"] {
      flex: 1;
      height: 4px;
      -webkit-appearance: none;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
      outline: none;

      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 14px;
        height: 14px;
        background: white;
        border-radius: 50%;
        cursor: pointer;
      }
    }
  }

}
</style>
