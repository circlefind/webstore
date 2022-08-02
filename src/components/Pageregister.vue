<template>
  <q-dialog
    v-model="windRegister"
    ref="dialog"
    persistent
    full-height
    full-width
    transition-show="fade"
    transition-hide="fade"
  >
    <q-card class="q-pa-none">
      <q-toolbar>
        <q-toolbar-title class="text-primary">Daftar</q-toolbar-title>
        <q-btn flat dense no-caps icon="close" v-close-popup />
      </q-toolbar>
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-5">
            <div>
              Sudah punya akun?
              <q-btn flat no-caps color="primary" label="Log in" @click="disLogin()" />
            </div>
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
                      :value="formregister.name"
                      v-model="formregister.name"
                      label="Nama"
                      hint="Nama Lengkap"
                      maxlength="50"
                      :error="$v.formregister.name.$error"
                      error-message="Nama Lengkap harus diisi"
                    ></q-input>
                  </div>
                  <div class="col-6">
                    <q-input
                      dense
                      counter
                      :value="formregister.email"
                      v-model="formregister.email"
                      label="Email"
                      maxlength="50"
                      :error="$v.formregister.email.$error"
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
                      v-model="formregister.datebirth"
                      mask="##-##-####"
                      label="Tanggal Lahir"
                      :error="$v.formregister.datebirth.$error"
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
                              v-model="formregister.datebirth"
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
                      :value="formregister.phone"
                      v-model="formregister.phone"
                      label="No. Handphone"
                      mask="#############"
                      maxlength="12"
                      :error="$v.formregister.phone.$error"
                      error-message="No. Handphone harus diisi"
                    ></q-input>
                  </div>
                </div>
                <div class="text-weight-bold">Alamat Pengiriman</div>
                <q-input
                  dense
                  counter
                  :value="formregister.address"
                  v-model="formregister.address"
                  label="Alamat"
                  hint="Alamat Lengkap"
                  maxlength="100"
                  input-class="text-uppercase"
                  :error="$v.formregister.address.$error"
                  error-message="Alamat Lengkap harus diisi"
                ></q-input>
                <div class="row q-col-gutter-md">
                  <div class="col-6">
                    <q-select
                      dense
                      ref="province"
                      bottom-slots
                      v-model="formregister.idprovince"
                      :options="dataProvince"
                      option-value="id"
                      option-label="region"
                      emit-value
                      map-options
                      label="Provinsi"
                      hint="Pilih Provinsi"
                      @input="getRegency(formregister.idprovince)"
                      :error="$v.formregister.idprovince.$error"
                      error-message="Provinsi harus diisi"
                    ></q-select>
                  </div>
                  <div class="col-6">
                    <q-select
                      dense
                      bottom-slots
                      v-model="formregister.idregency"
                      :options="dataRegency"
                      option-value="id"
                      option-label="region"
                      emit-value
                      map-options
                      label="Kota / Kabupaten"
                      hint="Pilih Kota / Kabupaten"
                      @input="getDistrict(formregister.idregency)"
                      :error="$v.formregister.idregency.$error"
                      error-message="Kota / Kabupaten harus diisi"
                    ></q-select>
                  </div>
                </div>
                <div class="row q-col-gutter-md">
                  <div class="col-6">
                    <q-select
                      dense
                      bottom-slots
                      v-model="formregister.iddistrict"
                      :options="dataDistrict"
                      option-value="id"
                      option-label="region"
                      emit-value
                      map-options
                      label="Kecamatan"
                      hint="Pilih Kecamatan"
                      :error="$v.formregister.iddistrict.$error"
                      error-message="Kecamatan harus diisi"
                    ></q-select>
                  </div>
                  <div class="col-6">
                    <q-input
                      dense
                      counter
                      :value="formregister.postalcode"
                      v-model="formregister.postalcode"
                      label="Kode Pos"
                      mask="#####"
                      maxlength="5"
                      :error="$v.formregister.postalcode.$error"
                      error-message="Kode pos harus diisi"
                    ></q-input>
                  </div>
                </div>
                <div class="text-weight-bold">Password</div>
                <div class="row q-col-gutter-md">
                  <div class="col-6">
                    <q-input
                      dense
                      v-model="formregister.password"
                      type="password"
                      label="Password"
                      hint="Password minimal 6 karakter"
                      maxlength="50"
                      :error="$v.formregister.password.$error"
                      error-message="Password harus diisi"
                    >
                      <template v-slot:prepend>
                        <q-icon name="o_lock" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-6">
                    <q-input
                      dense
                      v-model="formregister.passwordconfirm"
                      type="password"
                      label="Konfirmasi Password"
                      maxlength="50"
                      :error="$v.formregister.passwordconfirm.$error"
                      error-message="Konfirmasi password harus sama dengan password"
                    >
                      <template v-slot:prepend>
                        <q-icon name="o_lock" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <br />
            <div align="right">
              <q-btn
                no-caps
                unelevated
                color="primary"
                label="Daftar"
                :loading="loading"
                @click="onRegister()"
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { required, email, sameAs, minLength } from 'vuelidate/lib/validators'
import Pagelogin from 'src/components/Pagelogin'
export default {
  name: 'Pageregister',
  data () {
    return {
      loading: false,
      windRegister: false,
      dataProvince: null,
      dataRegency: null,
      dataDistrict: null,
      formregister: {
        name: '',
        email: '',
        idgender: '',
        datebirth: '',
        phone: '',
        address: '',
        idprovince: '',
        idregency: '',
        iddistrict: '',
        postalcode: '',
        password: '',
        passwordconfirm: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      loggedIn: 'auth/loggedIn'
    }),
    ...mapState({
      dataRegion: (state) => state.regions.region,
      dataUser: (state) => state.auth.user
    })
  },
  validations: {
    formregister: {
      name: { required },
      email: { required, email },
      datebirth: { required },
      address: { required },
      idprovince: { required },
      idregency: { required },
      iddistrict: { required },
      postalcode: { required },
      phone: { required },
      password: { required, minLength: minLength(6) },
      passwordconfirm: { sameAsPassword: sameAs('password') }
    }
  },
  methods: {
    show () {
      this.$v.$reset()
      this.formregister.name = ''
      this.formregister.email = ''
      this.formregister.datebirth = '01-01-1970'
      this.formregister.phone = ''
      this.formregister.address = ''
      this.formregister.idprovince = ''
      this.formregister.idregency = ''
      this.formregister.iddistrict = ''
      this.formregister.postalcode = ''
      this.formregister.password = ''
      this.formregister.passwordconfirm = ''
      this.dataRegency = null
      this.dataDistrict = null
      this.dataProvince = this.dataRegion.filter((item) => item.id.length === 2)
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    onDialogHide () {
      this.windLogin = false
    },
    getRegency (id) {
      this.formregister.idregency = null
      this.formregister.iddistrict = null
      Promise.all([
        (this.dataRegency = this.dataRegion.filter(
          (item) => item.id.length === 5 && item.id.substring(0, 2) === id
        ))
      ]).finally(() => {})
    },
    // Proses untuk mengambil data kecamatan
    getDistrict (id) {
      this.formregister.iddistrict = null
      Promise.all([
        (this.dataDistrict = this.dataRegion.filter(
          (item) => item.id.length === 8 && item.id.substring(0, 5) === id
        ))
      ]).finally(() => {})
    },
    disLogin () {
      this.$refs.dialog.hide()
      this.$q.dialog({
        component: Pagelogin
      })
    },
    onRegister () {
      this.$v.formregister.$touch()
      if (!this.$v.formregister.$error) {
        this.loading = true
        this.$store
          .dispatch('auth/register', this.formregister)
          .then(() => {
            this.$q.notify({
              position: 'top',
              color: 'positive',
              textColor: 'white',
              timeout: 2500,
              icon: 'done',
              message: 'Proses regristrasi berhasil!'
            })
            this.windRegister = false
          })
          .catch(() => {
            this.$q.notify({
              position: 'bottom-right',
              color: 'negative',
              textColor: 'white',
              timeout: 2500,
              icon: 'error_outline',
              message: 'Registrasi gagal diproses!'
            })
          })
          .finally(() => {
            this.loading = false
          })
      }
    }
  }
}
</script>
