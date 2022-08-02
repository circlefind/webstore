<template>
  <q-layout v-if="dataConfig" view="hHh LpR fff" class="non-selectable">
    <q-header bordered :style="{opacity: 0.8}">
      <q-toolbar class="bg-white text-black">
        <q-avatar rounded size="42px">
          <img :src="$apiURL + '/images/logo.png'" />
        </q-avatar>
        <q-toolbar-title
          class="text-primary text-h6 cursor-pointer"
          @click="toHome()"
        >{{ this.dataConfig.corporatename }}</q-toolbar-title>
        <q-input
          dense
          standout="bg-primary text-white"
          v-model="filter"
          maxlength="100"
          style="width:400px;"
          @keydown.enter.prevent="ProdFilter()"
        >
          <template v-slot:before>
            <q-btn no-caps flat text-color="black" label="Kategori" class="q-mr-sm">
              <q-menu v-if="dataCategories.length" self="top left">
                <q-list style="min-width: 200px" class="bg-white">
                  <q-item
                    clickable
                    v-close-popup
                    v-for="dataCategory in dataCategories"
                    :key="dataCategory.id"
                  >
                    <q-item-section @click="ProdCategory(dataCategory.id, dataCategory.category)">
                      <q-item-label>{{ dataCategory.category }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </template>
          <template v-slot:append>
            <q-icon name="search" class="cursor-pointer" @click="ProdFilter()" />
          </template>
        </q-input>
        <q-space />
        <q-btn-group unelevated>
          <q-btn no-caps label="Produk Diskon" color="primary" :to="{ name: 'productpromo' }" />
          <q-btn v-if="loggedIn" no-caps icon="shopping_cart" color="primary">
            <q-badge v-if="dataCart.length" color="red" floating>{{dataCart.length}}</q-badge>
            <q-menu self="top right">
              <div v-if="dataCart.length">
                <q-list style="min-width: 300px" class="bg-white">
                  <div align="right">
                    <q-btn
                      flat
                      no-caps
                      unelevated
                      color="primary"
                      label="Lihat sekarang"
                      :to="{ name: 'cart' }"
                    />
                  </div>
                  <q-markup-table flat class="bg-white">
                    <tbody>
                      <tr v-for="data in dataCart" :key="data.id">
                        <td class="text-center">
                          <q-avatar rounded>
                            <img :src="$apiURL + '/images/product/' + data.imgname" />
                          </q-avatar>
                        </td>
                        <td class="text-left">
                          <div>{{ data.productname }}</div>
                          <div>Jumlah: {{data.qty}}</div>
                        </td>
                        <td class="text-right">Rp {{formatPrice(data.qty * data.price)}}</td>
                      </tr>
                    </tbody>
                  </q-markup-table>
                </q-list>
              </div>
            </q-menu>
          </q-btn>
          <q-btn v-if="loggedIn" no-caps label="Transaksi" color="primary" @click="toTransaction()">
            <q-badge
              v-if="dataNotification && dataNotification.transaction == true"
              color="red"
              rounded
              floating
            />
          </q-btn>
          <q-btn v-if="!loggedIn" no-caps color="primary" label="Daftar" @click="disRegister()" />
          <q-btn v-if="!loggedIn" no-caps color="primary" label="Log in" @click="disLogin()" />
          <q-btn v-if="loggedIn" color="primary">
            <q-avatar rounded icon="person" size="md" />
            <q-menu self="top left">
              <q-list style="min-width: 180px" class="bg-white">
                <q-item clickable v-close-popup @click="dispUpdate()">
                  <q-item-section avatar>
                    <q-icon name="person" color="primary" />
                  </q-item-section>
                  <q-item-section>Profil</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="onLogout()">
                  <q-item-section avatar>
                    <q-icon name="logout" color="primary" />
                  </q-item-section>
                  <q-item-section>Log out</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-btn-group>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer bordered class="bg-white text-grey-8">
      <div class="row justify-center q-pa-md">
        <div class="col-10">
          <div class="row q-col-gutter-md">
            <div class="col-6 q-gutter-sm">
              <div align="left">
                <span class="text-grey-8 text-weight-bold text-h6">{{ dataConfig.corporatename }}</span>
              </div>
              <div>
                <router-link
                  class="text-weight-regular cursor-pointer text-grey-8"
                  style="display: inline-block;text-decoration:none;"
                  :to="{ name: 'about' }"
                >Tentang Kami</router-link>
              </div>
              <div>
                <router-link
                  class="text-weight-regular cursor-pointer text-grey-8"
                  style="display: inline-block;text-decoration:none;"
                  :to="{ name: 'transmethod' }"
                >Cara Transaksi</router-link>
              </div>
            </div>
            <div class="col-6 q-gutter-sm">
              <div align="left">
                <span class="text-grey-8 text-weight-bold text-h6">Hubungi Kami</span>
              </div>
              <div class="cursor-pointer text-weight-regular text-grey-8">
                <q-avatar rounded size="24px">
                  <q-img src="~assets/facebook.png" />
                </q-avatar>&nbsp;Facebook
              </div>
              <div class="cursor-pointer text-weight-regular text-grey-8">
                <q-avatar rounded size="24px">
                  <q-img src="~assets/whatsapp.png" />
                </q-avatar>&nbsp;Whatsapp
              </div>
            </div>
          </div>
          <div class="text-body2 text-grey-6 q-pt-md" align="center">
            Copyright © 2022
            <span>{{dataConfig.corporatename}}</span>
          </div>
        </div>
      </div>
    </q-footer>

    <q-dialog
      v-model="windUpdate"
      persistent
      full-height
      full-width
      transition-show="fade"
      transition-hide="fade"
    >
      <q-card class="q-pa-none">
        <q-toolbar>
          <q-toolbar-title class="text-primary">Profil</q-toolbar-title>
          <q-btn flat dense no-caps icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-5">
              <q-img src="~assets/register.png" />
            </div>
            <div class="col-7">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-weight-bold">Data Pribadi</div>
                  <div class="row q-col-gutter-md">
                    <div class="col-6">
                      <q-input
                        dense
                        counter
                        :value="formupdate.name"
                        v-model="formupdate.name"
                        label="Nama"
                        hint="Nama Lengkap"
                        maxlength="50"
                        :error="$v.formupdate.name.$error"
                        error-message="Nama Lengkap harus diisi"
                      ></q-input>
                    </div>
                    <div class="col-6">
                      <q-input
                        dense
                        counter
                        :value="formupdate.email"
                        v-model="formupdate.email"
                        label="Email"
                        maxlength="50"
                        :error="$v.formupdate.email.$error"
                        error-message="Nama Lengkap harus diisi"
                      >
                        <template v-slot:prepend>
                          <q-icon name="o_email" />
                        </template>
                      </q-input>
                    </div>
                  </div>
                  <div class="row q-col-gutter-md">
                    <div class="col-6">
                      <q-input
                        readonly
                        dense
                        bottom-slots
                        v-model="formupdate.datebirth"
                        mask="##-##-####"
                        label="Tanggal Lahir"
                        :error="$v.formupdate.datebirth.$error"
                        error-message="Tanggal Lahir harus diisi"
                      >
                        <template v-slot:after>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="datebirth"
                              transition-show="none"
                              transition-hide="none"
                            >
                              <q-date
                                color="primary"
                                mask="DD-MM-YYYY"
                                v-model="formupdate.datebirth"
                                @input="() => $refs.datebirth.hide()"
                              />
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                    <div class="col-6">
                      <q-input
                        dense
                        bottom-slots
                        :value="formupdate.phone"
                        v-model="formupdate.phone"
                        label="No. Handphone"
                        mask="#############"
                        maxlength="12"
                        :error="$v.formupdate.phone.$error"
                        error-message="No. Handphone harus diisi"
                      ></q-input>
                    </div>
                  </div>
                  <div class="text-weight-bold">Alamat Pengiriman</div>
                  <q-input
                    dense
                    counter
                    :value="formupdate.address"
                    v-model="formupdate.address"
                    label="Alamat"
                    hint="Alamat Lengkap"
                    maxlength="100"
                    input-class="text-uppercase"
                    :error="$v.formupdate.address.$error"
                    error-message="Alamat Lengkap harus diisi"
                  ></q-input>
                  <div class="row q-col-gutter-md">
                    <div class="col-6">
                      <q-select
                        dense
                        ref="province"
                        bottom-slots
                        v-model="formupdate.idprovince"
                        :options="dataProvince"
                        option-value="id"
                        option-label="region"
                        emit-value
                        map-options
                        label="Provinsi"
                        hint="Pilih Provinsi"
                        @input="getRegency(formupdate.idprovince)"
                        :error="$v.formupdate.idprovince.$error"
                        error-message="Provinsi harus diisi"
                      ></q-select>
                    </div>
                    <div class="col-6">
                      <q-select
                        dense
                        bottom-slots
                        v-model="formupdate.idregency"
                        :options="dataRegency"
                        option-value="id"
                        option-label="region"
                        emit-value
                        map-options
                        label="Kota / Kabupaten"
                        hint="Pilih Kota / Kabupaten"
                        @input="getDistrict(formupdate.idregency)"
                        :error="$v.formupdate.idregency.$error"
                        error-message="Kota / Kabupaten harus diisi"
                      ></q-select>
                    </div>
                  </div>
                  <div class="row q-col-gutter-md">
                    <div class="col-6">
                      <q-select
                        dense
                        bottom-slots
                        v-model="formupdate.iddistrict"
                        :options="dataDistrict"
                        option-value="id"
                        option-label="region"
                        emit-value
                        map-options
                        label="Kecamatan"
                        hint="Pilih Kecamatan"
                        :error="$v.formupdate.iddistrict.$error"
                        error-message="Kecamatan harus diisi"
                      ></q-select>
                    </div>
                    <div class="col-6">
                      <q-input
                        dense
                        counter
                        :value="formupdate.postalcode"
                        v-model="formupdate.postalcode"
                        label="Kode Pos"
                        mask="#####"
                        maxlength="5"
                        :error="$v.formupdate.postalcode.$error"
                        error-message="Kode pos harus diisi"
                      ></q-input>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
              <br />
              <div align="right">
                <q-btn
                  unelevated
                  no-caps
                  color="primary"
                  label="Ubah Password"
                  class="q-mr-sm"
                  @click="dispUserPassword()"
                />
                <q-btn
                  no-caps
                  unelevated
                  color="primary"
                  label="Update"
                  :loading="loading"
                  @click="onUpdate()"
                />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="windUserPassword" persistent transition-show="none" transition-hide="none">
      <q-card class="q-pa-none" style="width:580px">
        <q-toolbar>
          <q-toolbar-title class="text-primary">Ubah Password</q-toolbar-title>
          <q-btn flat dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-5">
              <q-img :src="$apiURL + '/images/password.png'" />
            </div>
            <div class="col-7">
              <q-card flat bordered>
                <q-card-section>
                  <q-input
                    dense
                    :value="formuserpassword.currentpassword"
                    v-model="formuserpassword.currentpassword"
                    type="password"
                    label="Password Lama"
                    maxlength="50"
                    :error="$v.formuserpassword.currentpassword.$error"
                    error-message="Masukan Password Lama"
                  ></q-input>
                  <q-input
                    dense
                    :value="formuserpassword.password"
                    v-model="formuserpassword.password"
                    type="password"
                    label="Password Baru"
                    maxlength="50"
                    :error="$v.formuserpassword.password.$error"
                    error-message="Password baru minimal 6 karakter"
                  ></q-input>
                  <q-input
                    dense
                    :value="formuserpassword.passwordconfirm"
                    v-model="formuserpassword.passwordconfirm"
                    type="password"
                    label="Konfirmasi Password Baru"
                    maxlength="50"
                    :error="$v.formuserpassword.passwordconfirm.$error"
                    error-message="Konfirmasi Password Baru Tidak Sesuai"
                  ></q-input>
                </q-card-section>
              </q-card>
              <br />
              <div align="right">
                <q-btn
                  unelevated
                  no-caps
                  :loading="loading"
                  color="primary"
                  label="Update"
                  @click="onChangePassword()"
                />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <Pagelogin ref="pagelogin" />
    <Pageregister ref="pageregister" />
  </q-layout>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { required, email, sameAs, minLength } from 'vuelidate/lib/validators'
import { date } from 'quasar'
import Pagelogin from 'src/components/Pagelogin'
import Pageregister from 'src/components/Pageregister'
export default {
  name: 'Main',
  preFetch ({ store }) {},
  components: {
    Pagelogin,
    Pageregister
  },
  data () {
    return {
      tab: '',
      drawerMenu: true,
      version: null,
      windUpdate: false,
      windUserPassword: false,
      filter: '',
      loading: false,
      dataProvince: null,
      dataRegency: null,
      dataDistrict: null,
      formupdate: {
        name: '',
        email: '',
        idgender: '',
        datebirth: '',
        phone: '',
        address: '',
        idprovince: '',
        idregency: '',
        iddistrict: '',
        postalcode: ''
      },
      formuserpassword: {
        currentpassword: '',
        password: '',
        passwordconfirm: ''
      }
    }
  },
  validations: {
    formupdate: {
      name: { required },
      email: { required, email },
      datebirth: { required },
      address: { required },
      idprovince: { required },
      idregency: { required },
      iddistrict: { required },
      postalcode: { required },
      phone: { required }
    },
    formuserpassword: {
      currentpassword: { required, minLength: minLength(6) },
      password: { required, minLength: minLength(6) },
      passwordconfirm: { sameAsPassword: sameAs('password') }
    }
  },
  computed: {
    ...mapGetters({
      loggedIn: 'auth/loggedIn'
    }),
    ...mapState({
      dataConfig: (state) => state.configs.config,
      dataLoad: (state) => state.configs.loadstate,
      dataCategories: (state) => state.categories.category,
      dataRegion: (state) => state.regions.region,
      dataCart: (state) => state.carts.cart,
      dataListTransaction: (state) => state.transactions.listtransaction,
      dataNotification: (state) => state.transactions.notification,
      dataUser: (state) => state.auth.user
    })
  },
  created () {},
  mounted () {
    if (this.loggedIn) {
      this.$store.dispatch('carts/getcart', this.dataUser.id)
    }
    this.countDownTimer()
  },
  methods: {
    countDownTimer () {
      setTimeout(() => {
        if (this.loggedIn) {
          this.$store.dispatch('transactions/getnotification', this.dataUser.id)
        }
        this.countDownTimer()
      }, 10000)
    },
    // Merubah format dari float menjadi desimal
    formatPrice (value) {
      const val = (value / 1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    toHome () {
      this.$router.push('/')
    },
    toTransaction () {
      this.$store.dispatch('transactions/removenotification', this.dataUser.id)
      this.$store.dispatch('transactions/getlisttransaction', this.dataUser.id)
      this.$router.push({ name: 'transaction' }).catch(() => {})
    },
    // link ke halaman pencarian produk
    ProdFilter (filter) {
      if (this.filter !== '' && this.$route.params.filter !== this.filter) {
        this.$router
          .push({
            name: 'productfilter',
            params: { filter: this.filter }
          })
          .catch(() => {})
      }
    },
    // Link ke halaman Kategori produk
    ProdCategory (id, category) {
      this.$router
        .push({
          name: 'productcategory',
          params: { id: id, category: category }
        })
        .catch(() => {})
    },
    // Menampilkan window daftar atau registrasi
    disRegister () {
      this.$refs.pageregister.show()
    },
    // Menampilkan Window login
    disLogin () {
      this.$refs.pagelogin.show()
    },
    dispUpdate () {
      this.$v.$reset()
      this.formupdate = Object.assign(this.formupdate, this.dataUser)
      Promise.all([
        (this.formupdate.datebirth = date.formatDate(
          this.formupdate.datebirth,
          'DD-MM-YYYY'
        )),
        (this.dataProvince = this.dataRegion.filter(
          (item) => item.id.length === 2
        )),
        (this.dataRegency = this.dataRegion.filter(
          (item) =>
            item.id.length === 5 &&
            item.id.substring(0, 2) === this.formupdate.idprovince
        )),
        (this.dataDistrict = this.dataRegion.filter(
          (item) =>
            item.id.length === 8 &&
            item.id.substring(0, 5) === this.formupdate.idregency
        ))
      ]).finally(() => {
        this.windUpdate = true
      })
    },
    dispUserPassword () {
      this.$v.$reset()
      Promise.all([
        (this.formuserpassword.currentpassword = ''),
        (this.formuserpassword.password = ''),
        (this.formuserpassword.passwordconfirm = ''),
        (this.isPwd = true),
        (this.isCurPwd = true)
      ]).finally(() => {
        this.windUserPassword = true
      })
    },
    // Proses untuk mengambil data kota / kabupaten
    getRegency (id) {
      this.formupdate.idregency = null
      this.formupdate.iddistrict = null
      Promise.all([
        (this.dataRegency = this.dataRegion.filter(
          (item) => item.id.length === 5 && item.id.substring(0, 2) === id
        ))
      ]).finally(() => {})
    },
    // Proses untuk mengambil data kecamatan
    getDistrict (id) {
      this.formupdate.iddistrict = null
      Promise.all([
        (this.dataDistrict = this.dataRegion.filter(
          (item) => item.id.length === 8 && item.id.substring(0, 5) === id
        ))
      ]).finally(() => {})
    },
    // Proses update profil
    onUpdate () {
      this.$v.formupdate.$touch()
      if (!this.$v.formupdate.$error) {
        this.loading = true
        this.$store
          .dispatch('auth/updateuser', this.formupdate)
          .then(() => {
            this.$q.notify({
              position: 'top',
              color: 'positive',
              textColor: 'white',
              timeout: 2500,
              icon: 'done',
              message: 'Profil telah diupdate!'
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
              message: 'Profil gagal diupdate!'
            })
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    // Proses untuk login
    onLogin () {
      this.$v.formlogin.$touch()
      if (!this.$v.formlogin.$error) {
        this.loading = true
        this.$store
          .dispatch('auth/login', this.formlogin)
          .then(() => {
            this.$q.notify({
              position: 'top',
              color: 'positive',
              textColor: 'white',
              timeout: 2500,
              icon: 'done',
              message: 'Anda telah login!'
            })
            this.windLogin = false
            this.$store.dispatch('carts/getcart', this.dataUser.id)
          })
          .catch((error) => {
            if (error.response) {
              this.$q.notify({
                position: 'bottom-right',
                color: 'negative',
                textColor: 'white',
                timeout: 3500,
                icon: 'error_outline',
                message: 'Login gagal! Periksa Email atau Password!'
              })
            }
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    // Proses untuk logout
    onLogout () {
      this.$store
        .dispatch('auth/logout')
        .then(() => {
          this.$q.notify({
            position: 'top',
            color: 'positive',
            textColor: 'white',
            timeout: 2500,
            icon: 'done',
            message: 'Anda telah logout!'
          })
          this.$router.push({ name: 'home' })
        })
        .catch((error) => {
          if (error.response.status === 401) {
            this.$router.push({ name: 'home' })
          }
        })
        .finally(() => {})
    },
    onChangePassword () {
      this.$v.formuserpassword.$touch()
      if (!this.$v.formuserpassword.$error) {
        this.loading = true
        this.$store
          .dispatch('auth/changepassword', this.formuserpassword)
          .then(() => {
            this.windUserPassword = false
            this.$q.notify({
              position: 'top',
              color: 'positive',
              textColor: 'white',
              timeout: 2500,
              icon: 'done',
              message: 'Password telah diupdate!'
            })
          })
          .catch((error) => {
            if (error.response) {
              this.$q.notify({
                position: 'top',
                color: 'red-10',
                textColor: 'white',
                timeout: 2500,
                icon: 'error_outline',
                message: 'Password gagal diupdate!'
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
