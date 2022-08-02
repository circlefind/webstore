<template>
  <q-page>
    <div class="row justify-center q-pt-md">
      <div class="col-10">
        <div class="item-center">
          <q-avatar rounded size="84px">
            <q-img src="~assets/logo.png" />
          </q-avatar>
          <span class="text-h6 text-black">Cara Transaksi</span>
        </div>
        <div v-html="'<br>'"></div>
        <div v-html="dataConfig.transmethod"></div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'Transmethod',
  preFetch ({ store }) {},
  data () {
    return {}
  },
  computed: {
    ...mapState({
      dataConfig: (state) => state.configs.config
    }),
    ...mapGetters({
      dataUser: 'auth/user',
      loggedIn: 'auth/loggedIn'
    })
  },
  mounted () {},
  methods: {}
}
</script>
