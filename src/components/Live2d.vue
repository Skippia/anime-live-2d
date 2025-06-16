<script setup lang="ts">
// Import
// import { LAppDelegate } from "../live2d/src/lappdelegate";
import * as LAppDefine from "../live2d/src/lappdefine";
import { LAppDelegate } from "../live2d/src/lappdelegate";
import { LAppGlManager } from "../live2d/src/lappglmanager";


// Load Model
window.addEventListener(
  "load",
  () => {
    // Initialize WebGL and create the application instance
    if (
      //  !LAppGlManager.get() ||
      !LAppDelegate.getInstance().initialize()
    ) {
      return;
    }


    LAppDelegate.getInstance().run();
  },
  { passive: true }
);


// Release Instance before unload
window.addEventListener(
  "onbeforeunload",
  () => LAppDelegate.releaseInstance(),
  { passive: true }
);


// Resize Screen
window.addEventListener(
  "resize",
  () => {
    if (LAppDefine.CanvasSize === "auto") {
      LAppDelegate.getInstance().onResize();
    }
  },
  { passive: true }
);
</script>

<template>
  <div>
    <audio id="voice"/>
  </div>
</template>
