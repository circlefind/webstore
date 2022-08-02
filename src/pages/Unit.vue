<template>
  <q-page>
    <q-toolbar class="q-pl-md q-pr-md bgtitle">
      <q-icon name="credit_card" size="sm" />
      <q-toolbar-title>
        <span class="text-primary">PENGATURAN</span> SATUAN PRODUK
      </q-toolbar-title>
      <q-space />
      <q-input dense debounce="300" v-model="filter" input-class="text-uppercase" maxlength="20">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-btn-group flat class="q-ml-sm">
        <q-btn flat dense color="primary" icon="add" @click="dispInsert()">
          <q-tooltip anchor="bottom middle" self="top end">TAMBAH SATUAN PRODUK</q-tooltip>
        </q-btn>
      </q-btn-group>
    </q-toolbar>
    <q-separator />
    <q-scroll-area style="height: calc(100vh - 136px);">
      <div class="q-pa-md">
        <q-card flat square bordered class="q-pa-none" style="min-height: calc(100vh - 170px);">
          <q-card-section>
            <q-table
              flat
              :data="dataUnit"
              :columns="columns"
              row-key="id"
              :rows-per-page-options="[50]"
              :filter="filter"
              rows-per-page-label="DATA PER HALAMAN:"
              separator="none"
              hide-no-data
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td auto-width key="unit" :props="props">{{ props.row.unit }}</q-td>
                  <q-td key="unitdesc" :props="props">{{ props.row.unitdesc }}</q-td>
                  <q-td key="actions" :props="props">
                    <q-btn-group flat>
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
                        >UPDATE {{ props.row.productname }}</q-tooltip>
                      </q-btn>
                    </q-btn-group>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </q-scroll-area>

    <q-dialog v-model="windInsert" persistent transition-show="none" transition-hide="none">
      <q-card class="q-pa-none" style="width:380px">
        <q-toolbar class="bgtitle">
          <q-avatar square>
            <q-icon name="add" class="menu-icon" size="sm" />
          </q-avatar>
          <q-toolbar-title>SATUAN PRODUK</q-toolbar-title>
          <q-btn flat dense icon="close" v-close-popup />
        </q-toolbar>
        <q-separator />
        <q-card-section>
          <q-input
            dense
            counter
            :value="forminsert.unit"
            v-model="forminsert.unit"
            label="Satuan Produk"
            maxlength="50"
            :error="$v.forminsert.unit.$error"
            error-message="Satuan Produk harus diisi"
          ></q-input>
          <q-input
            dense
            counter
            :value="forminsert.unitdesc"
            v-model="forminsert.unitdesc"
            label="Deskripsi"
            maxlength="50"
          ></q-input>
        </q-card-section>
        <q-card-section align="right">
          <q-btn
            unelevated
            no-caps
            color="primary"
            label="Simpan"
            :loading="loading"
            @click="onInsert()"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="windUpdate" persistent transition-show="none" transition-hide="none">
      <q-card class="q-pa-none" style="width:380px">
        <q-toolbar class="bgtitle">
          <q-avatar square>
            <q-icon name="crop_din" class="menu-icon" size="sm" />
          </q-avatar>
          <q-toolbar-title>SATUAN PRODUK</q-toolbar-title>
          <q-btn flat dense icon="close" v-close-popup />
        </q-toolbar>
        <q-separator />
        <q-card-section>
          <q-input
            dense
            counter
            :value="formupdate.unit"
            v-model="formupdate.unit"
            label="Satuan Produk"
            maxlength="50"
            :error="$v.formupdate.unit.$error"
            error-message="Satuan Produk harus diisi"
          ></q-input>
          <q-input
            dense
            counter
            :value="formupdate.unitdesc"
            v-model="formupdate.unitdesc"
            label="Deskripsi"
            maxlength="50"
          ></q-input>
        </q-card-section>
        <q-card-section align="right">
          <q-btn-group flat>
            <q-btn
              unelevated
              no-caps
              color="primary"
              label="Update"
              :loading="loading"
              @click="onUpdate()"
            />
          </q-btn-group>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="windDelete" persistent transition-show="none" transition-hide="none">
      <q-card class="q-pa-none" style="width:420px">
        <q-toolbar class="bgtitle">
          <q-avatar square>
            <q-icon name="delete" class="menu-icon" size="sm" />
          </q-avatar>
          <q-toolbar-title>SATUAN PRODUK</q-toolbar-title>
          <q-btn padding="xs sm" unelevated icon="close" v-close-popup />
        </q-toolbar>
        <q-separator />
        <q-card-section class="text-info">HAPUS SATUAN PRODUK {{ this.formupdate.productname }}?</q-card-section>
        <q-card-section align="right">
          <q-btn
            unelevated
            no-caps
            color="primary"
            label="Hapus"
            :loading="loading"
            @click="onDelete()"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import { date } from 'quasar'
export default {
  name: 'Unit',
  preFetch ({ store }) {
    store.dispatch('units/getunit')
  },
  data () {
    return {
      loading: false,
      filter: '',
      windInsert: false,
      windUpdate: false,
      windDelete: false,
      forminsert: {
        unit: '',
        unitdesc: ''
      },
      formupdate: {
        id: '',
        unit: '',
        unitdesc: ''
      },
      columns: [
        {
          name: 'unit',
          align: 'left',
          label: 'SATUAN',
          field: 'unit',
          sortable: false,
          headerClasses: 'bgtitle'
        },
        {
          name: 'unitdesc',
          align: 'left',
          label: 'DESKRIPSI',
          field: 'unitdesc',
          sortable: false,
          headerClasses: 'bgtitle'
        },
        { name: 'actions', align: 'right', label: '', headerClasses: 'bgtitle' }
      ]
    }
  },
  validations: {
    forminsert: {
      unit: { required }
    },
    formupdate: {
      unit: { required }
    }
  },
  computed: {
    ...mapState({
      dataConfig: (state) => state.configs.config,
      dataUnit: (state) => state.units.unit,
      dataUser: (state) => state.auth.user
    })
  },
  mounted () {},
  methods: {
    formatDate (fdate) {
      const formattedString = date.formatDate(fdate, 'DD-MM-YYYY')
      return formattedString
    },
    formatPrice (value) {
      const val = (value / 1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    dispInsert () {
      this.$v.$reset()
      Promise.all([
        (this.forminsert.unit = ''),
        (this.forminsert.unitdesc = '')
      ]).finally(() => {
        this.windInsert = true
      })
    },
    dispUpdate (data) {
      this.$v.$reset()
      Promise.all([
        (this.formupdate = Object.assign(this.formupdate, data))
      ]).finally(() => {
        this.windUpdate = true
      })
    },
    dispDelete () {
      this.windDelete = true
    },
    onInsert () {
      this.$v.forminsert.$touch()
      if (!this.$v.forminsert.$error) {
        this.loading = true
        this.$store
          .dispatch('units/insertunit', this.forminsert)
          .then(() => {
            this.$q.notify({
              position: 'bottom-right',
              color: 'positive',
              textColor: 'white',
              timeout: 2500,
              icon: 'done',
              message: 'SATUAN berhasil disimpan!'
            })
            this.windInsert = false
          })
          .catch(() => {
            this.$q.notify({
              position: 'bottom-right',
              color: 'negative',
              textColor: 'white',
              timeout: 2500,
              icon: 'error_outline',
              message: 'SATUAN gagal disimpan!'
            })
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    onUpdate () {
      this.$v.formupdate.$touch()
      if (!this.$v.formupdate.$error) {
        this.loading = true
        this.$store
          .dispatch('units/updateunit', this.formupdate)
          .then(() => {
            this.$q.notify({
              position: 'bottom-right',
              color: 'positive',
              textColor: 'white',
              timeout: 2500,
              icon: 'done',
              message: 'SATUAN berhasil diupdate!'
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
              message: 'SATUAN gagal diupdate!'
            })
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    onDelete () {
      this.loading = true
      this.$store
        .dispatch('savingproducts/deleteproduct', this.formupdate)
        .then(() => {
          this.$q.notify({
            position: 'bottom-right',
            color: 'positive',
            textColor: 'white',
            timeout: 2500,
            icon: 'done',
            message: 'SATUAN telah dihapus!'
          })
          this.windUpdate = false
          this.windDelete = false
        })
        .catch(() => {
          this.$q.notify({
            position: 'bottom-right',
            color: 'negative',
            textColor: 'white',
            timeout: 2500,
            icon: 'error_outline',
            message: 'SATUAN gagal dihapus!'
          })
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
