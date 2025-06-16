<template>
  <div class="audio-player">
    <h2>Live2D Lip Sync in Vue</h2>
    <div class="character-list">
      <label for="characters">① Select a Live2D Character</label>
      <select
        v-model="selectedCharacter"
        id="characters"
        @change="loadCharacterFromList"
      >
        <option value="" disabled>Select a character...</option>
        <option
          v-for="character in characterDetails"
          :key="character.id"
          :value="character"
        >
          {{ character.name }}
        </option>
      </select>
    </div>

    <div class="divider"></div>

    <div class="sample-lines">
      <label>② Play a Sample Line</label>
      <div class="sample-lines-container">
        <div
          v-for="(audioData, index) in audioDataObj"
          :key="index"
          class="sample-line"
        >
          <p>{{ audioData.text }}</p>
          <button @click="playSample(audioData.file)">▶ Play</button>
        </div>
      </div>
    </div>

    <div class="upload-audio">
      <label for="upload-own">
        Or, Upload Your Own Audio File (Note: It will be removed when you reload
        the page)
        <h5>Supports MP3, WAV, OGG, etc</h5></label
      >
      <input
        id="upload-own"
        type="file"
        @change="onFileChange"
        accept="audio/*"
      />
    </div>

    <!-- Add a button to play  -->
    <button @click="playOwnAudio" v-if="ownUploadedAudioSrc">
      Play Own Audio
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { LAppLive2DManager } from "../live2d/src/lapplive2dmanager";
import * as LAppDefine from "../live2d/src/lappdefine";

const audioDataObj = ref<{ file: string; text: string }[]>([
  {
    file: "en_1_audio.mp3",
    text: "Hello there! Have you ever noticed how a simple smile can change the mood of a whole conversation? It's like a little spark that makes everything feel lighter. So, why not try smiling a bit more today?",
  },
  {
    file: "en_2_audio.mp3",
    text: "Did you know that humming a tune can actually improve your mood? It's like giving your brain a little massage with sound. Try it now-just hum your favorite song and see how you feel!",
  },
]);

const selectedCharacter = ref<{ id: number; name: string } | null>(
  LAppDefine.ModelDir.length > 0
    ? { id: 0, name: LAppDefine.ModelDir[0] }
    : null
);
const isChangeCharacter = ref(false);
const ownUploadedAudioSrc = ref<string | null>(null);

const characterDetails = ref<{ id: number; name: string }[]>(
  LAppDefine.ModelDir.map((name: string, index: number) => ({
    id: index,
    name,
  }))
);

const loadCharacterFromList = () => {
  if (selectedCharacter.value) {
    isChangeCharacter.value = true;
  }
};

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  ownUploadedAudioSrc.value = null;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    ownUploadedAudioSrc.value = URL.createObjectURL(file);
  }
};

const playSample = (audioSrc: string) => {
  console.log("Playing sample:", audioSrc);
  const audioSrcPath = "/src/live2d/src/audio/" + audioSrc;
  startSpeak(audioSrcPath);
};

const playOwnAudio = () => {
  if (ownUploadedAudioSrc.value) {
    startSpeak(ownUploadedAudioSrc.value);
  }
};

const startSpeak = (audioSrc: string) => {
  // change the shown character if a new character was selected
  if (isChangeCharacter.value && selectedCharacter.value) {
    LAppLive2DManager.getInstance().changeScene(selectedCharacter.value.id);
  }

  // play uploaded audio
  LAppLive2DManager.getInstance().stopAudio();
  if (audioSrc) {
    LAppLive2DManager.getInstance().onAudioPlay(audioSrc);
  }

  isChangeCharacter.value = false;
};
</script>

<style scoped>
h2 {
  color: #037c8e;
}
.audio-player {
  height: 90%;
  font-family: Arial, sans-serif;
  padding: 20px;
  position: fixed;
  top: 10px;
  right: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
  width: 400px;
  text-align: left;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.upload-audio {
  margin-top: 20px;
}
.sample-lines-container {
  max-height: 400px;
  overflow-y: auto;
}

.sample-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #e9e9e9;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 5px;
}

.character-list,
.sample-lines,
.upload-audio {
  margin-bottom: 15px;
}

button {
  cursor: pointer;
  transition: background 0.2s ease-in-out;
  background: #80d7e4;
}

button:hover {
  background: #c4e3e9;
}

.divider {
  margin: 15px 0;
  height: 1px;
  background-color: #ddd;
}

label {
  font-weight: bold;
  font-size: 14px;
  display: block;
  margin-bottom: 5px;
}
</style>
