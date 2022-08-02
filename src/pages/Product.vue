<template>
  <q-page v-if="dataProduct">
    <div class="row justify-center q-pt-md">
      <div class="col-10">
        <q-breadcrumbs class="text-grey" active-color="primary">
          <template v-slot:separator>
            <q-icon size="1.2em" name="arrow_forward" color="text-grey" />
          </template>

          <q-breadcrumbs-el label="Home" :to="{ name: 'home' }" />
          <q-breadcrumbs-el
            :label="dataProduct.category"
            :to="{
          name: 'productcategory',
          params: { id: dataProduct.idcategory, category: dataProduct.category }
          }"
          />
          <q-breadcrumbs-el :label="dataProduct.productname" />
        </q-breadcrumbs>
        <div class="row">
          <div class="col-4">
            <q-card flat>
              <q-card-section>
                <q-responsive :ratio="1" style="width: 500px; max-width: 100%;">
                  <q-carousel
                    swipeable
                    animated
                    v-model="slide"
                    thumbnails
                    infinite
                    :fullscreen.sync="fullscreen"
                    class="rounded-borders"
                  >
                    <q-carousel-slide
                      v-for="dataImg in dataImgproduct"
                      :key="dataImg.id"
                      :name="dataImg.imgcount"
                      :img-src="$apiURL + '/images/product/' + dataImg.imgname"
                    ></q-carousel-slide>
                    <template v-slot:control>
                      <q-carousel-control position="top-right" :offset="[18, 18]">
                        <q-btn
                          unelevated
                          round
                          dense
                          color="primary"
                          text-color="white"
                          :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
                          @click="fullscreen = !fullscreen"
                        />
                      </q-carousel-control>
                    </template>
                  </q-carousel>
                </q-responsive>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-5">
            <q-card flat class="bg-transparent">
              <q-card-section class="q-pb-xs">
                <div class="text-h6 text-bold">{{ dataProduct.productname }}</div>
                <div class="text-subtitle2">Terjual {{ ' ' + dataProduct.sold }}</div>
              </q-card-section>
              <q-card-section class="q-pb-xs q-pt-xs">
                <span
                  class="text-bold"
                  style="font-size: 28px;"
                >Rp {{ formatPrice(dataProduct.price - (dataProduct.price * dataProduct.discount) / 100 ) }}</span>
              </q-card-section>
              <q-card-section v-if="dataProduct.discount > 0" class="q-pt-xs">
                <q-badge transparent color="red" class="q-pa-xs">{{ dataProduct.discount }}%</q-badge>
                {{' '}}
                <span
                  class="text-strike text-caption"
                >Rp {{ formatPrice(dataProduct.price) }}</span>
              </q-card-section>
              <q-card-section>
                <q-tabs
                  v-model="tab"
                  dense
                  class="text-grey"
                  active-color="primary"
                  indicator-color="primary"
                  align="left"
                  no-caps
                  :breakpoint="0"
                  narrow-indicator
                >
                  <q-tab name="detail" label="Detail" />
                </q-tabs>

                <q-separator />

                <q-tab-panels v-model="tab" animated class="bg-transparent">
                  <q-tab-panel name="detail">
                    <div>
                      <span class="text-weight-bold">Berat:&nbsp;</span>
                      <span>{{ dataProduct.weight }} Gram</span>
                    </div>
                    <div>
                      <span class="text-weight-bold">Kategori:&nbsp;</span>
                      <router-link
                        class="text-weight-medium cursor-pointer text-primary"
                        style="display: inline-block;text-decoration:none;"
                        :to="{name: 'productcategory', params: { id: dataProduct.idcategory, category: dataProduct.category }}"
                      >{{ dataProduct.category }}</router-link>
                    </div>
                    <br />
                    <div v-html="dataProduct.productdesc"></div>
                  </q-tab-panel>
                </q-tab-panels>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-3">
            <q-card flat bordered class="bg-transparent">
              <q-card-section class="q-gutter-sm q-pa-md">
                <div class="text-subtitle1 text-weight-bold">Atur jumlah dan catatan</div>
                <div class="row items-center text-center">
                  <div class="col-2">
                    <q-btn
                      no-caps
                      flat
                      color="primary"
                      padding="none"
                      icon="remove"
                      @click="removeQTY()"
                    />
                  </div>
                  <div class="col-4">
                    <q-input
                      dense
                      readonly
                      outlined
                      maxlength="50"
                      input-class="text-center"
                      v-model="qty"
                      mask="###"
                    ></q-input>
                  </div>
                  <div class="col-2">
                    <q-btn
                      no-caps
                      flat
                      color="primary"
                      padding="none"
                      icon="add"
                      @click="addQTY()"
                    />
                  </div>
                  <div class="col-4">
                    <span class="text-subtitle2">Stok</span>
                    <span class="text-subtitle2 text-weight-bold">{{ ' ' + dataProduct.stock }}</span>
                  </div>
                </div>
                <q-input
                  dense
                  counter
                  label="Catatan"
                  maxlength="20"
                  v-model="remark"
                  class="full-width"
                ></q-input>
                <q-btn
                  no-caps
                  unelevated
                  color="primary"
                  class="full-width"
                  label="+ Keranjang"
                  @click="onInsertCart()"
                />
                <q-btn
                  no-caps
                  outline
                  color="primary"
                  class="full-width"
                  label="Beli Sekarang"
                  @click="onCart()"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <div class="row justify-center q-pt-md">
      <div class="col-10">
        <div class="text-subtitle1 text-weight-bold">Produk lainnya</div>
        <q-table
          v-if="dataOtherproduct"
          grid
          flat
          bordered
          :data="dataOtherproduct"
          :columns="columns"
          :pagination.sync="pagination"
          :rows-per-page-options="[20, 30, 40, 50]"
          rows-per-page-label="Produk lainnya :"
          no-data-label="Tidak ada produk yang dapat ditampilkan"
          no-results-label="Tidak ada produk yang dapat ditampilkan"
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
import { CurrencyDirective } from 'vue-currency-input'
import { required } from 'vuelidate/lib/validators'
import { date } from 'quasar'
import Pagelogin from 'src/components/Pagelogin'

export default {
  name: 'Product',
  preFetch ({ store }) {},
  directives: {
    currency: CurrencyDirective
  },
  data () {
    return {
      dataProvince: null,
      dataRegency: null,
      dataDistrict: null,
      pagination: {
        page: 1,
        rowsPerPage: 20
      },
      tab: 'detail',
      fullscreen: false,
      slide: 0,
      images: [],
      loading: false,
      filter: '',
      windInsert: false,
      windUpdate: false,
      qty: 1,
      remark: '',
      forminsert: {
        idproduct: '',
        iduser: '',
        qty: 0,
        weight: 0,
        remark: ''
      },
      formupdate: {
        id: '',
        productname: '',
        idcategory: '',
        productdesc: '',
        nominal: 0,
        price: 0,
        discount: 0,
        stock: 0,
        idunit: ''
      },
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
  validations: {
    forminsert: {
      idproduct: { required },
      iduser: { required },
      qty: { required }
    },
    formupdate: {
      productname: { required },
      idcategory: { required },
      productdesc: { required },
      nominal: { required },
      stock: { required },
      idunit: { required }
    }
  },
  computed: {
    options () {
      return {
        locale: undefined,
        currency: null
      }
    },
    ...mapGetters({
      loggedIn: 'auth/loggedIn'
    }),
    ...mapState({
      dataConfig: (state) => state.configs.config,
      dataRegion: (state) => state.regions.region,
      dataProduct: (state) => state.products.product,
      dataOtherproduct: (state) => state.products.otherproduct,
      dataImgproduct: (state) => state.products.imgproduct,
      dataCategory: (state) => state.categories.category,
      dataCart: (state) => state.carts.cart,
      dataUser: (state) => state.auth.user
    })
  },
  watch: {
    '$route.params.id': function (id) {
      this.slide = 1
      this.$store.dispatch('products/detailproduct', this.$route.params.id)
      this.$store.dispatch('products/otherproduct', this.$route.params.id)
    }
  },
  mounted () {
    this.slide = 1
    this.$store.dispatch('products/detailproduct', this.$route.params.id)
    this.$store.dispatch('products/otherproduct', this.$route.params.id)
  },
  methods: {
    addQTY () {
      const QTY = this.qty + 1
      if (QTY > this.dataProduct.stock) {
        this.qty = this.dataProduct.stock
      } else {
        this.qty = QTY
      }
    },
    removeQTY () {
      const QTY = this.qty - 1
      if (QTY < 1) {
        this.qty = 1
      } else {
        this.qty = QTY
      }
    },
    formatDate (fdate) {
      const formattedString = date.formatDate(fdate, 'DD-MM-YYYY')
      return formattedString
    },
    formatPrice (value) {
      const val = (value / 1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    formatDecimal (IDR) {
      const val = (Math.abs(IDR) / 1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    disShopchart () {
      this.windShopchart = true
    },
    onInsertCart () {
      if (this.loggedIn) {
        this.$v.forminsert.$touch()
        this.forminsert.idproduct = this.dataProduct.id
        this.forminsert.iduser = this.dataUser.id
        this.forminsert.qty = this.qty
        this.forminsert.weight = this.dataProduct.weight
        this.forminsert.remark = this.remark
        if (!this.$v.forminsert.$error) {
          this.loading = true
          this.$store
            .dispatch('carts/insertcart', this.forminsert)
            .then(() => {
              this.$q.notify({
                position: 'top',
                color: 'positive',
                textColor: 'white',
                timeout: 2500,
                icon: 'done',
                message: 'Produk telah ditambahkan ke keranjang!'
              })
              this.qty = 1
              this.remark = ''
            })
            .catch((error) => {
              if (error.response) {
                this.$q.notify({
                  position: 'bottom-right',
                  color: 'negative',
                  textColor: 'white',
                  timeout: 3500,
                  icon: 'error_outline',
                  message: 'Produk gagal ditambahkan ke keranjang!'
                })
              }
            })
            .finally(() => {
              this.loading = false
            })
        }
      } else {
        this.$q.dialog({
          component: Pagelogin
        })
      }
    },
    onCart () {
      if (this.loggedIn) {
        this.$v.forminsert.$touch()
        this.forminsert.idproduct = this.dataProduct.id
        this.forminsert.iduser = this.dataUser.id
        this.forminsert.qty = this.qty
        this.forminsert.weight = this.dataProduct.weight
        this.forminsert.remark = this.remark
        if (!this.$v.forminsert.$error) {
          this.loading = true
          this.$store
            .dispatch('carts/insertcart', this.forminsert)
            .then(() => {
              this.$router.push({
                name: 'cart'
              })
              this.qty = 1
              this.remark = ''
            })
            .catch((error) => {
              if (error.response) {
                this.$q.notify({
                  position: 'bottom-right',
                  color: 'negative',
                  textColor: 'white',
                  timeout: 3500,
                  icon: 'error_outline',
                  message: 'Produk gagal ditambahkan ke keranjang!'
                })
              }
            })
            .finally(() => {
              this.loading = false
            })
        }
      } else {
        this.$q.dialog({
          component: Pagelogin
        })
      }
    },
    ProdDetail (id) {
      this.slide = 0
      this.$router.push({
        name: 'product',
        params: { id: id }
      })
    }
  }
}
</script>
