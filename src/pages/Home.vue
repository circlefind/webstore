<template>
  <q-page>
    <div class="row justify-center q-pt-md">
      <div class="col-10">
        <q-responsive :ratio="16/4" style="width: 1920px; max-width: 100%;">
          <q-carousel
            v-if="dataBanner.length"
            animated
            v-model="slide"
            arrows
            infinite
            autoplay
            class="rounded-borders"
            ref="carousel"
          >
            <q-carousel-slide
              v-for="dataImg in dataBanner"
              :key="dataImg.id"
              :name="dataImg.imgcount"
              :img-src="$apiURL + '/images/banner/' + dataImg.imgbanner"
            ></q-carousel-slide>
          </q-carousel>
          <q-carousel
            v-else
            animated
            v-model="slide"
            arrows
            infinite
            autoplay
            class="rounded-borders"
            ref="carousel"
          >
            <q-carousel-slide :name="1" img-src="~assets/banner01.png" />
            <q-carousel-slide :name="2" img-src="~assets/banner02.png" />
          </q-carousel>
        </q-responsive>
        <br />
        <q-table
          v-if="dataProduct"
          grid
          flat
          bordered
          :filter="filter"
          :data="dataProduct"
          :columns="columns"
          :pagination.sync="pagination"
          :rows-per-page-options="[20, 30, 40, 50]"
          rows-per-page-label="Produk :"
          no-data-label="Tidak ada produk yang dapat ditampilkan"
          no-results-label="Tidak ada produk yang dapat ditampilkan"
          class="text-grey-6"
          hide-header
          hide-no-data
        >
          <div slot="item" slot-scope="props" class="q-pa-xs col-xs-6 col-sm-4 col-md-2 col-lg-2">
            <q-card
              class="bg-white q-pa-none cursor-pointer shadow-1"
              @click="ProdDetail(props.row.id)"
            >
              <q-img v-if="props.row.imgname==null" src="~assets/blank.png"></q-img>
              <q-img v-else :src="$apiURL + '/images/product/' + props.row.imgname" ratio="1"></q-img>
              <q-card-section class="q-pa-sm">
                <div class="ellipsis text-black">{{ props.row.productname }}</div>
                <div
                  class="ellipsis text-weight-bold text-black"
                >Rp {{ formatPrice(props.row.price - (props.row.price * props.row.discount) / 100 ) }}</div>
                <div v-if="props.row.discount > 0" align="left">
                  <q-badge transparent color="red" class="q-pa-xs">{{ props.row.discount }}%</q-badge>&nbsp;
                  <span
                    class="text-strike text-caption text-grey-8"
                  >Rp {{ formatPrice(props.row.price) }}</span>
                </div>
                <div v-else align="left" class="text-grey-8">Stok sisa&nbsp;{{ props.row.stock }}</div>
              </q-card-section>
            </q-card>
          </div>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'Home',
  preFetch ({ store }) {},
  data () {
    return {
      slide: 0,
      filter: '',
      pagination: {
        page: 1,
        rowsPerPage: 20
      },
      loading: false,
      columns: [
        {
          name: 'productname',
          align: 'left',
          field: 'productname',
          sortable: false
        },
        { name: 'imgname', field: 'imgname', sortable: false },
        { name: 'price', align: 'right', field: 'price', sortable: false }
      ]
    }
  },
  computed: {
    ...mapState({
      dataConfig: (state) => state.configs.config,
      dataCategories: (state) => state.categories.categories,
      dataProduct: (state) => state.products.listproduct,
      dataBanner: (state) => state.banners.banner
    }),
    ...mapGetters({
      dataUser: 'auth/user',
      loggedIn: 'auth/loggedIn'
    })
  },
  mounted () {
    this.$store.dispatch('products/listproduct')
    this.$store.dispatch('banners/getbanner')
  },
  methods: {
    formatPrice (value) {
      const val = (value / 1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    ProdDetail (id) {
      this.$router.push({
        name: 'product',
        params: { id: id }
      })
    }
  }
}
</script>
