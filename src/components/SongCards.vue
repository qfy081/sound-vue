<template>
  <div class="content">
    <div class="padder" :style="{ height: `${paddingTop}px` }"></div>

    <sRow
      v-for="(item, index) in normalized"
      :authedLikes="authedLikes"
      :authedUser="authedUser"
      :start="start"
      :chunk="chunk"
      :index="index"
      :list="item"
      :playingSongId="playingSongId"
      :playlist="playlist"
      :songEntities="songEntities"
      :userEntities="userEntities"
      :key="`songs-row-${(start/chunk) + index}`"
    >
    </sRow>

    <div class="padder" :style="{ height: `${paddingBottom}px` }"></div>

    <Spinner v-if="isFetching"></Spinner>
  </div>
</template>

<style></style>

<script>
  import Spinner from './Spinner.vue';
  import Row from './songCards/Row.vue';

  export default {
    data() {
      // when in the same router-view,
      // watch playlistData trigger, when switching views this should recalculate
      const items = this.playlistData.items || [];

      return {
        paddingBottom: 0,
        paddingTop: 0,
        start: 0,
        end: items.length,

        chunk: 5,
      };
    },
    components: {
      Spinner,
      sRow: Row,
    },
    computed: {
      isFetching() {
        const { playlistData } = this;
        return 'isFetching' in playlistData ? playlistData.isFetching : true;
      },
      normalized() {
        const { end, start, chunk, playlistData } = this;
        const items = playlistData.items ? playlistData.items : [];
        const result = [];

        for (let i = start; i < end; i += chunk) {
          result.push(items.slice(i, i + chunk));
        }

        return result;
      },
    },
    methods: {
      onScroll() {
        this.checkIfNeedFetch();
        this.checkIfUpdateData();
      },

      checkIfNeedFetch() {
        if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 200)) {
          this.$store.dispatch('fetchSongsIfNeeded', this.playlist);
        }
      },

      checkIfUpdateData() {
        const { end, paddingBottom, paddingTop, start } = this.getScrollState();

        if (paddingTop !== this.paddingTop
          || paddingBottom !== this.paddingBottom
          || end !== this.end
          || start !== this.start) {
          this.paddingBottom = paddingBottom;
          this.paddingTop = paddingTop;
          this.start = start;
          this.end = end;
        }
      },

      getScrollState() {
        const { eHeight, playlistData } = this;
        const items = playlistData.items ? playlistData.items : [];

        const MARGIN_TOP = 20;
        const ROW_HEIGHT = 132;
        const ITEMS_PER_ROW = 5;
        const scrollY = window.scrollY;

        let paddingTop = 0;
        let paddingBottom = 0;
        let start = 0;
        let end = items.length;

        if ((scrollY - ((ROW_HEIGHT * 3) + (MARGIN_TOP * 2))) > 0) {
          const rowsToPad =
            Math.floor((scrollY - ((ROW_HEIGHT * 2) + (MARGIN_TOP))) / (ROW_HEIGHT + MARGIN_TOP));

          paddingTop = rowsToPad * (ROW_HEIGHT + MARGIN_TOP);
          start = rowsToPad * ITEMS_PER_ROW;
        }

        const rowsOnScreen = Math.ceil(eHeight / (ROW_HEIGHT + MARGIN_TOP));
        const itemsToShow = (rowsOnScreen + 5) * ITEMS_PER_ROW;

        if (items.length > (start + itemsToShow)) {
          end = start + itemsToShow;
          const rowsToPad = Math.ceil((items.length - end) / ITEMS_PER_ROW);
          paddingBottom = rowsToPad * (ROW_HEIGHT + MARGIN_TOP);
        }

        return {
          end,
          paddingBottom,
          paddingTop,
          start,
        };
      },
    },
    watch: {
      playlistData() {
        console.log('playlistData, changed');
        this.checkIfUpdateData();
      },
    },
    mounted() {
      window.addEventListener('scroll', this.onScroll, false);
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.onScroll, false);
    },
    props: {
      authedLikes: {
        type: Object,
        required: true,
      },
      authedUser: Object,
      eHeight: Number,
      playingSongId: Number,
      playlist: {
        type: String,
        required: true,
      },
      playlistData: {
        type: Object,
        required: true,
      },
      songEntities: {
        type: Object,
        required: true,
      },
      userEntities: {
        type: Object,
        required: true,
      },
    },
  };
</script>
