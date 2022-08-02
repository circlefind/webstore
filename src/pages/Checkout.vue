<template>
  <q-page>
    <div class="row justify-center q-pt-md">
      <div class="col-10">
        <div class="row q-col-gutter-md">
          <div class="col-9">
            <div class="item-center">
              <q-avatar rounded size="84px">
                <q-img src="~assets/checkout.png" />
              </q-avatar>
              <span class="text-h6">&nbsp;Checkout</span>
            </div>
            <br />
            <div class="text-h6">Alamat Pengiriman</div>
            <q-separator />
            <br />
            <div class="text-weight-bold">{{ dataUser.name }}</div>
            <div>{{ dataUser.phone }}</div>
            <div>{{ dataUser.address }}</div>
            <div>KEC. {{ dataUser.district }},&nbsp;{{ dataUser.regency }},&nbsp;{{ dataUser.province }}&nbsp;{{ dataUser.postalcode }}</div>
            <br />
            <q-separator />
            <q-table
              flat
              :data="dataCart"
              :columns="columns"
              row-key="id"
              separator="none"
              rows-per-page-label="DATA PER HALAMAN:"
              :pagination.sync="pagination"
              hide-bottom
              hide-header
              hide-no-data
              dense
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="productname" :props="props">
                    <div class="row">
                      <div class="col-1" align="left">
                        <q-avatar rounded>
                          <img :src="$apiURL + '/images/product/' + props.row.imgname" />
                        </q-avatar>
                      </div>
                      <div class="col-8">
                        <div class="text-weight-bold">{{ props.row.productname }}</div>
                        <div v-if="props.row.discount > 0" align="left">
                          <q-badge transparent color="red" class="q-pa-xs">{{ props.row.discount }}%</q-badge>&nbsp;
                          <span
                            class="text-strike text-caption"
                          >Rp{{ formatPrice(props.row.price) }}</span>
                          <span
                            class="text-weight-bold text-subtitle2"
                          >&nbsp;Rp{{ formatPrice(props.row.price - (props.row.price * props.row.discount) / 100) }}</span>
                        </div>
                        <div v-else align="left">
                          <span
                            class="text-weight-bold text-subtitle2"
                          >&nbsp;Rp{{ formatPrice(props.row.price) }}</span>
                        </div>
                        <div align="left">
                          <span class="text-caption">Jumlah:{{ props.row.qty }}&nbsp;Barang</span>
                        </div>
                      </div>
                      <div class="col-3" align="right">
                        <span
                          class="text-weight-bold text-subtitle2"
                        >&nbsp;Rp{{ formatPrice((props.row.price - (props.row.price * props.row.discount) / 100) * props.row.qty) }}</span>
                      </div>
                    </div>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
            <q-separator />
            <div class="row q-pa-md">
              <div class="col-9 text-weight-bold">Total</div>
              <div
                class="col-3 text-weight-bold"
                align="right"
              >Rp {{formatPrice(sumPrice - sumDisc)}}</div>
            </div>
          </div>
          <div class="col-3">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-h6">Ringkasan Belanja</div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <div class="col-8">Total Harga Barang</div>
                  <div class="col-4" align="right">Rp {{formatPrice(sumPrice)}}</div>
                </div>
                <div class="row">
                  <div class="col-8">Total Diskon</div>
                  <div class="col-4" align="right">Rp {{formatPrice(sumDisc)}}</div>
                </div>
              </q-card-section>
              <q-separator />
              <q-card-section>
                <div class="row">
                  <div class="col-8 text-weight-bold">Total Belanja</div>
                  <div
                    class="col-4 text-weight-bold"
                    align="right"
                  >Rp {{formatPrice(sumPrice - sumDisc)}}</div>
                </div>
                <div class="row">
                  <div class="col-8">Berat</div>
                  <div class="col-4" align="right">{{ sumWeight }}&nbsp;Gram</div>
                </div>
              </q-card-section>
              <q-card-section>
                <div class="text-weight-bold">Pilih Kurir</div>
                <q-select
                  dense
                  bottom-slots
                  v-model="forminsert.idcourier"
                  :options="dataCourier"
                  option-value="id"
                  option-label="courier"
                  emit-value
                  map-options
                  :error="$v.forminsert.idcourier.$error"
                  error-message="Pilih Kurir"
                >
                  <template
                    v-slot:selected-item="scope"
                  >{{ scope.opt.courier }} {{ scope.opt.courierdesc }}</template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                      <q-item-section>
                        <q-item-label>{{ scope.opt.courier }} - {{ scope.opt.courierdesc }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </q-card-section>
              <q-card-section>
                <q-btn
                  unelevated
                  no-caps
                  color="primary"
                  class="full-width"
                  label="Proses"
                  @click="onInsert()"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'
const columns = [
  {
    name: 'productname',
    required: true,
    label: 'PRODUK',
    align: 'left',
    field: 'productname',
    sortable: false,
    headerClasses: 'bgtable'
  }
]
export default {
  name: 'Checkout',
  preFetch ({ store }) {},
  data () {
    return {
      loading: false,
      columns,
      qty: 1,
      pagination: {
        sortBy: 'name',
        descending: false,
        page: 0,
        rowsPerPage: 0
      },
      forminsert: {
        iduser: '',
        weight: 0,
        idcourier: ''
      }
    }
  },
  validations: {
    forminsert: {
      idcourier: { required }
    }
  },
  computed: {
    ...mapState({
      dataConfig: (state) => state.configs.config,
      dataCart: (state) => state.carts.cart,
      dataCourier: (state) => state.couriers.courier
    }),
    ...mapGetters({
      dataUser: 'auth/user',
      loggedIn: 'auth/loggedIn'
    }),
    sumPrice () {
      return this.dataCart.reduce((sum, total) => {
        return (sum += parseFloat(total.price) * total.qty)
      }, 0)
    },
    sumDisc () {
      return this.dataCart.reduce((sum, total) => {
        return (
          (sum +=
            (parseFloat(total.price) * parseFloat(total.discount)) / 100) *
          total.qty
        )
      }, 0)
    },
    sumWeight () {
      return this.dataCart.reduce((sum, total) => {
        return (sum += parseFloat(total.weight))
      }, 0)
    }
  },
  mounted () {
    this.$store.dispatch('carts/getcart', this.dataUser.id)
  },
  methods: {
    formatPrice (value) {
      const val = (value / 1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    onInsert () {
      this.$v.forminsert.$touch()
      this.forminsert.iduser = this.dataUser.id
      this.forminsert.weight = this.sumWeight
      if (!this.$v.forminsert.$error) {
        this.loading = true
        this.$store
          .dispatch('transactions/updatecourier', this.forminsert)
          .then(() => {
            this.$q.notify({
              position: 'top',
              color: 'positive',
              textColor: 'white',
              timeout: 2500,
              icon: 'done',
              message: 'Transaksi telah diproses!'
            })
            this.$store.dispatch('carts/getcart', this.dataUser.id)
            this.$router.push({
              name: 'transaction'
            })
          })
          .catch((error) => {
            if (error.response) {
              this.$q.notify({
                position: 'bottom-right',
                color: 'negative',
                textColor: 'white',
                timeout: 3500,
                icon: 'error_outline',
                message: 'Transaksi gagal diproses!'
              })
            }
          })
          .finally(() => {
            this.loading = false
          })
      }
    }
  }
}
</script>
