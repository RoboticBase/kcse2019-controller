<template>
  <div class="touchButton container">
    <div class="row form-group">
      <div class="col-sm-12 align-self-end">
        <button type="submit" class="btn btn-outline-secondary btn-block btn-lg touchButton"
          @click="click" ontouchstart="">
          {{ buttonText }}
        </button>
      </div>
      <audio id="click_se" preload="auto" ref="click_se">
        <source src="/static/sounds/se_maoudamashii_system38.mp3" type="audio/mp3"/>
      </audio>
    </div>
  </div>
</template>

<script>
export default {
  name: 'touchButton',
  props: ['buttonText'],
  methods: {
    click() {
      let click_se = this.$refs.click_se
      if (typeof(click_se.currentTime) != 'undefined') {
        click_se.currentTime = 0
      }
      click_se.play()

      this.$emit('clickEvent')
    },
  },
}
</script>

<style>
.touchButton {
  height: 400px;
  font-weight: 700;
  font-size: 200px;
}
.touchButton:hover {
  color: #6c757d;
  border-color: #6c757d;
  background-color: #ffffff;
}
</style>
