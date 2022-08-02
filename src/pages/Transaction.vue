<template>
  <q-page>
    <div class="row justify-center q-pt-md">
      <div class="col-10">
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <div class="item-center">
              <q-avatar rounded size="84px">
                <q-img src="~assets/transaction.png" />
              </q-avatar>
              <span class="text-h6">&nbsp;Transaksi</span>
            </div>
            <br />
            <q-table
              flat
              :data="dataListTransaction"
              :columns="columns"
              row-key="id"
              separator="none"
              rows-per-page-label="Transaksi:"
              :pagination.sync="pagination"
              :rows-per-page-options="[5, 10, 20, 30]"
              hide-no-data
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="id" :props="props">{{ props.row.id }}</q-td>
                  <q-td key="datetr" :props="props">{{ formatDate(props.row.datetr) }}</q-td>
                  <q-td
                    key="courier"
                    :props="props"
                  >{{ props.row.courier }} {{ props.row.courierdesc }}</q-td>
                  <q-td key="subtotal" :props="props">Rp&nbsp;{{ formatPrice(props.row.subtotal) }}</q-td>
                  <q-td
                    key="couriercost"
                    :props="props"
                  >Rp&nbsp;{{ formatPrice(props.row.couriercost) }}</q-td>
                  <q-td
                    key="total"
                    :props="props"
                  >Rp&nbsp;{{ formatPrice(parseFloat(props.row.subtotal) + parseFloat(props.row.couriercost)) }}</q-td>
                  <q-td auto-width key="status" :props="props">
                    <div
                      v-if="props.row.status==0"
                      class="text-primary text-subtitle2"
                    >Menunggu Konfirmasi</div>
                    <div
                      v-if="props.row.status==1"
                      class="text-red text-subtitle2"
                    >Menunggu Pembayaran</div>
                    <div
                      v-if="props.row.status==2"
                      class="text-primary text-subtitle2"
                    >Menunggu Proses</div>
                    <div v-if="props.row.status==3" class="text-primary text-subtitle2">Dikirim</div>
                    <div v-if="props.row.status==4" class="text-green text-subtitle2">Selesai</div>
                  </q-td>
                  <q-td key="actions" :props="props">
                    <q-btn
                      dense
                      unelevated
                      text-color="info"
                      icon="crop_din"
                      @click="dispUpdate(props.row)"
                    >
                      <q-tooltip
                        anchor="bottom middle"
                        self="top end"
                      >DETAIL INVOICE {{ props.row.id }}</q-tooltip>
                    </q-btn>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </div>
      </div>
    </div>

    <q-dialog
      v-model="windUpdate"
      persistent
      full-height
      full-width
      transition-show="none"
      transition-hide="none"
    >
      <q-card class="q-pa-none">
        <q-toolbar>
          <q-toolbar-title class="text-primary">Status Pesanan</q-toolbar-title>
          <q-banner
            v-if="formupdate.status==0"
            inline-actions
            rounded
            dense
            class="bg-primary text-white"
          >Menunggu Konfirmasi</q-banner>
          <q-banner
            v-if="formupdate.status==1"
            inline-actions
            rounded
            dense
            class="bg-orange-5 text-white"
          >Menunggu Pembayaran</q-banner>
          <q-banner
            v-if="formupdate.status==2"
            inline-actions
            rounded
            dense
            class="bg-primary text-white"
          >Menunggu Proses</q-banner>
          <q-banner
            v-if="formupdate.status==3"
            inline-actions
            rounded
            dense
            class="bg-primary text-white"
          >Dikirim</q-banner>
          <q-banner
            v-if="formupdate.status==4"
            inline-actions
            rounded
            dense
            class="bg-primary text-white"
          >Selesai</q-banner>
          <q-btn flat dense icon="close" class="q-ml-md" v-close-popup />
        </q-toolbar>
        <div class="row q-col-gutter-md">
          <div class="col-6">
            <q-card-section>
              <div class="text-weight-bold">Nomor Invoice</div>
              <div>{{ formupdate.id }}</div>
              <br />
              <div class="text-weight-bold">Alamat Pengiriman</div>
              <div>{{ formupdate.name }}</div>
              <div>{{ formupdate.phone }}</div>
              <div>{{ formupdate.address }}</div>
              <div>KEC. {{ formupdate.district }},&nbsp;{{ formupdate.regency }},&nbsp;{{ formupdate.province }}&nbsp;{{ formupdate.postalcode }}</div>
            </q-card-section>
            <q-card-section>
              <div class="text-weight-bold">Daftar Belanja</div>
              <q-table
                flat
                :data="dataCheckout"
                :columns="colcheckout"
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
                    <q-td auto-width key="img" :props="props">
                      <q-avatar rounded size="40px">
                        <img :src="$apiURL + '/images/product/' + props.row.imgname" />
                      </q-avatar>
                    </q-td>
                    <q-td key="productname" :props="props">
                      <div class="text-weight-bold text-subtitle2">{{ props.row.productname }}</div>
                      <div v-if="props.row.discount > 0" align="left">
                        <q-badge transparent color="red" class="q-pa-xs">{{ props.row.discount }}%</q-badge>&nbsp;
                        <span
                          class="text-strike text-caption"
                        >Rp{{ formatPrice(props.row.price) }}</span>
                        <span>&nbsp;Rp{{ formatPrice(props.row.price - (props.row.price * props.row.discount) / 100) }}&nbsp;Jumlah:&nbsp;{{ props.row.qty }}&nbsp;Barang</span>
                      </div>
                      <div v-else align="left">
                        <span>Rp{{ formatPrice(props.row.price) }}&nbsp;Jumlah:&nbsp;{{ props.row.qty }}&nbsp;Barang</span>
                      </div>
                      <div align="left">
                        <span class="text-caption">Catatan:{{ props.row.remark }}</span>
                      </div>
                    </q-td>
                    <q-td auto-width key="subtotal" :props="props">
                      <span class="text-weight-bold">Rp{{ formatPrice(props.row.subtotal) }}</span>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </q-card-section>
          </div>
          <div class="col-6">
            <q-card-section>
              <q-card flat bordered>
                <q-card-section>
                  <div class="row">
                    <div class="col-4 text-weight-bold">Total Belanja</div>
                    <div
                      class="col-8 text-weight-bold"
                      align="right"
                    >Rp{{ formatPrice(sumSubtotal) }}</div>
                  </div>
                  <div class="row">
                    <div class="col-4">Kurir</div>
                    <div class="col-8">{{ formupdate.courier }}&nbsp;{{ formupdate.courierdesc }}</div>
                  </div>
                  <div class="row">
                    <div class="col-8">Berat</div>
                    <div class="col-4" align="right">{{ formupdate.weight }}&nbsp;Gram</div>
                  </div>
                  <div v-if="formupdate.status > 0">
                    <div class="row items-center">
                      <div class="col-4">Biaya Kurir</div>
                      <div class="col-8" align="right">Rp{{ formatPrice(formupdate.couriercost) }}</div>
                    </div>
                    <div v-if="formupdate.status > 2" class="row items-center">
                      <div class="col-4">Nomor Resi</div>
                      <div class="col-8" align="left">{{ formupdate.receiptnumber }}</div>
                    </div>
                    <div class="row items-center">
                      <div class="col-4">Kode Unik</div>
                      <div class="col-8" align="right">{{ formatPrice(formupdate.uniquecode) }}</div>
                    </div>
                    <q-separator />
                    <br />
                    <div class="row">
                      <div class="col-4 text-weight-bold">Total Transfer</div>
                      <div
                        class="col-8 text-weight-bold"
                        align="right"
                      >Rp{{ formatPrice(parseFloat(sumSubtotal) + parseFloat(formupdate.couriercost) + parseFloat(formupdate.uniquecode)) }}</div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
              <br />
              <div v-if="formupdate.status==1">
                <div class="text-weight-bold">Bank Transfer</div>
                <q-card flat bordered>
                  <q-markup-table>
                    <tbody>
                      <tr v-for="data in dataBank" :key="data.id">
                        <td class="text-left">
                          <div>{{ data.bankname }}&nbsp;CABANG&nbsp;{{ data.branch }}</div>
                          <div>No. Rekening:&nbsp;{{ data.accnumber }}&nbsp;an&nbsp;{{ data.accname }}</div>
                        </td>
                      </tr>
                    </tbody>
                  </q-markup-table>
                </q-card>
                <br />
                <div class="text-weight-bold">Konfirmasi Pembayaran</div>
                <q-card flat bordered>
                  <q-card-section>
                    <div class="row q-col-gutter-sm">
                      <div class="col-6">
                        <q-select
                          dense
                          bottom-slots
                          v-model="formupdate.idbank"
                          :options="dataBank"
                          option-value="id"
                          option-label="bank"
                          label="Pilih Bank Transfer"
                          emit-value
                          map-options
                          :error="$v.formupdate.idbank.$error"
                          error-message="Pilih Bank Transfer"
                        >
                          <template
                            v-slot:selected-item="scope"
                          >{{ scope.opt.bankname }} {{ scope.opt.branch }}</template>
                          <template v-slot:option="scope">
                            <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                              <q-item-section>
                                <q-item-label>{{ scope.opt.bankname }}</q-item-label>
                                <q-item-label caption>Cabang {{ scope.opt.branch }}</q-item-label>
                              </q-item-section>
                            </q-item>
                          </template>
                        </q-select>
                      </div>
                      <div class="col-6">
                        <q-input
                          dense
                          :value="formupdate.nominal"
                          v-model="formupdate.nominal"
                          ref="nominal"
                          label="Jumlah Transfer"
                          :error="$v.formupdate.nominal.$error"
                          error-message="Biaya Kurir harus di isi!"
                          v-currency="options"
                          input-class="text-right"
                          @focus="$event.target.select()"
                        ></q-input>
                      </div>
                    </div>
                    <div align="right">
                      <q-btn
                        unelevated
                        no-caps
                        color="primary"
                        label="Konfirmasi"
                        :loading="loading"
                        @click="onUpdateTransfer()"
                      />
                    </div>
                  </q-card-section>
                </q-card>
              </div>
              <div v-if="formupdate.status > 1">
                <div class="text-weight-bold">Pembayaran</div>
                <q-card flat bordered>
                  <q-card-section>
                    <div class="row">
                      <div class="col-4">Bank Transfer</div>
                      <div
                        class="col-4"
                        align="left"
                      >{{ formupdate.bankname }}&nbsp;{{ formupdate.branch }}</div>
                    </div>
                    <div class="row">
                      <div class="col-4">Jumlah Transfer</div>
                      <div class="col-8" align="right">Rp{{ formatPrice(formupdate.transfer) }}</div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
              <br />
              <div v-if="formupdate.status==3" align="right">
                <q-btn
                  unelevated
                  no-caps
                  color="primary"
                  label="Konfirmasi Telah Sampai"
                  :loading="loading"
                  @click="onUpdateArrived()"
                />
              </div>
            </q-card-section>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import { date } from 'quasar'
import { CurrencyDirective, getValue } from 'vue-currency-input'
export default {
  name: 'Transaction',
  preFetch ({ store }) {},
  directives: {
    currency: CurrencyDirective
  },
  data () {
    return {
      loading: false,
      windUpdate: false,
      qty: 1,
      pagination: {
        page: 1,
        rowsPerPage: 5
      },
      forminsert: {
        iduser: '',
        idcourier: ''
      },
      formupdate: {
        id: '',
        nominal: 0,
        idbank: '',
        transfer: 0,
        couriercost: 0
      },
      columns: [
        {
          name: 'id',
          required: true,
          label: 'INVOICE',
          align: 'left',
          field: 'id',
          sortable: false,
          headerClasses: 'bgtable'
        },
        {
          name: 'datetr',
          required: true,
          label: 'TANGGAL',
          align: 'left',
          field: 'datetr',
          sortable: false,
          headerClasses: 'bgtable'
        },
        {
          name: 'courier',
          required: true,
          label: 'KURIR',
          align: 'left',
          field: 'courier',
          sortable: false,
          headerClasses: 'bgtable'
        },
        {
          name: 'subtotal',
          required: true,
          label: 'SUBTOTAL',
          align: 'right',
          field: 'subtotal',
          sortable: false,
          headerClasses: 'bgtable'
        },
        {
          name: 'couriercost',
          required: true,
          label: 'BIAYA KURIR',
          align: 'right',
          field: 'couriercost',
          sortable: false,
          headerClasses: 'bgtable'
        },
        {
          name: 'total',
          required: true,
          label: 'TOTAL',
          align: 'right',
          sortable: false,
          headerClasses: 'bgtable'
        },
        {
          name: 'status',
          align: 'left',
          field: 'status',
          label: '',
          headerClasses: 'bgtable'
        },
        { name: 'actions', align: 'right', label: '', headerClasses: 'bgtable' }
      ],
      colcheckout: [
        {
          name: 'img',
          align: 'left',
          required: true,
          sortable: false,
          headerClasses: 'bgtable'
        },
        {
          name: 'productname',
          required: true,
          label: 'PRODUK',
          align: 'left',
          field: 'productname',
          sortable: false,
          headerClasses: 'bgtable'
        },
        {
          name: 'subtotal',
          required: true,
          label: 'SUBTOTAL',
          align: 'right',
          field: 'subtotal',
          sortable: false,
          headerClasses: 'bgtable'
        }
      ]
    }
  },
  validations: {
    forminsert: {
      idcourier: { required }
    },
    formupdate: {
      nominal: { required },
      idbank: { required }
    }
  },
  computed: {
    ...mapState({
      dataConfig: (state) => state.configs.config,
      dataListTransaction: (state) => state.transactions.listtransaction,
      dataCheckout: (state) => state.checkouts.checkout,
      dataBank: (state) => state.banks.bank
    }),
    ...mapGetters({
      dataUser: 'auth/user',
      loggedIn: 'auth/loggedIn'
    }),
    sumSubtotal () {
      return this.dataCheckout.reduce((sum, total) => {
        return (sum += parseFloat(total.subtotal))
      }, 0)
    },
    options () {
      return {
        locale: undefined,
        currency: null
      }
    }
  },
  mounted () {
    this.$store.dispatch('transactions/getlisttransaction', this.dataUser.id)
  },
  methods: {
    formatDate (fdate) {
      const formattedString = date.formatDate(fdate, 'DD-MM-YYYY')
      return formattedString
    },
    formatPrice (value) {
      const val = (value / 1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    dispWindQTY (data) {
      Promise.all([
        (this.forminsert = Object.assign(this.forminsert, data)),
        (this.forminsert.iduser = this.dataUser.id)
      ]).finally(() => {
        this.windUpdateQTY = true
      })
    },
    dispWindRemark (data) {
      Promise.all([
        (this.forminsert = Object.assign(this.forminsert, data)),
        (this.forminsert.iduser = this.dataUser.id)
      ]).finally(() => {
        this.windUpdateRemark = true
      })
    },
    dispUpdate (data) {
      this.$v.$reset()
      this.formupdate.nominal = 0
      Promise.all([
        (this.formupdate = Object.assign(this.formupdate, data)),
        this.$store.dispatch('checkouts/getcheckout', this.formupdate.id)
      ]).finally(() => {
        this.windUpdate = true
      })
    },
    onUpdateTransfer () {
      this.$v.formupdate.$touch()
      this.formupdate.transfer = getValue(this.$refs.nominal)
      if (!this.$v.formupdate.$error) {
        this.loading = true
        this.$store
          .dispatch('transactions/updatetransfer', this.formupdate)
          .then(() => {
            this.$q.notify({
              position: 'bottom-right',
              color: 'positive',
              textColor: 'white',
              timeout: 2500,
              icon: 'done',
              message: 'Konfirmasi Transfer berhasil!'
            })
            this.windUpdate = false
          })
          .catch(() => {
            this.$q.notify({
              position: 'bottom-right',
              color: 'negative',
              textColor: 'white',
              timeout: 2500,
              icon: 'error_outline',
              message: 'Konfirmasi Transfer gagal!'
            })
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    onUpdateArrived () {
      this.loading = true
      this.$store
        .dispatch('transactions/updatearrived', this.formupdate)
        .then(() => {
          this.$q.notify({
            position: 'top',
            color: 'positive',
            textColor: 'white',
            timeout: 2500,
            icon: 'done',
            message: 'Konfirmasi berhasil!'
          })
          this.windUpdate = false
        })
        .catch(() => {
          this.$q.notify({
            position: 'top',
            color: 'negative',
            textColor: 'white',
            timeout: 2500,
            icon: 'error_outline',
            message: 'Konfirmasi gagal!'
          })
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
