<template>
    <Popover class="song-heart" :class="className" v-if="!authedUser">
      <i class="icon ion-ios-heart" slot="content"></i>
      <div class="song-heart-popover popover-content" slot="bomb">
        <ul class="nav-user-popover-list">
          <li class="nav-user-popover-item">
            <a class="button orange block" href="#" @click.prevent="login">
              Sign into SoundCloud
            </a>
          </li>
        </ul>
      </div>
    </Popover>

    <a class="song-heart" :class="[className, isLiked ? 'liked' : '']" href="#" v-else @click.prevent="toggleLike">
      <i class="icon ion-ios-heart"></i>
    </a>
</template>

<style></style>

<script>
  import Popover from './Popover.vue';

  export default {
    components: {
      Popover,
    },
    methods: {
      login() {
        this.$store.dispatch('loginUser', false);
      },
      toggleLike() {
        this.$store.dispatch('toggleLike', this.songId);
      },
    },
    props: {
      authedUser: Object,
      className: String,
      isLiked: {
        type: Boolean,
        required: true,
      },
      songId: {
        type: Number,
        required: true,
      },
    },
  };
</script>
