<template>
  <q-dialog
    v-model="windLogin"
    ref="dialog"
    persistent
    transition-show="fade"
    transition-hide="fade"
  >
    <q-card class="q-pa-none q-dialog-plugin" style="width: 580px">
      <q-toolbar>
        <q-toolbar-title class="text-primary">Log in</q-toolbar-title>
        <q-btn flat dense icon="close" v-close-popup />
      </q-toolbar>
      <q-card-section>
        <div>
          Belum punya akun?
          <q-btn
            flat
            no-caps
            color="primary"
            label="Daftar"
            @click="disRegister()"
          />
        </div>
        <div class="row q-col-gutter-md">
          <div class="col-5">
            <q-img src="~assets/login.png" />
          </div>
          <div class="col-7">
            <q-card flat bordered>
              <q-card-section>
                <q-input
                  dense
                  v-model="formlogin.email"
                  label="Email"
                  maxlength="100"
                  :error="$v.formlogin.email.$error"
                  error-message="Email harus diisi"
                >
                  <template v-slot:prepend>
                    <q-icon name="o_email" />
                  </template>
                </q-input>
                <q-input
                  dense
                  v-model="formlogin.password"
                  type="password"
                  label="Password"
                  maxlength="50"
                  :error="$v.formlogin.password.$error"
                  error-message="Password harus diisi"
                >
                  <template v-slot:prepend>
                    <q-icon name="o_lock" />
                  </template>
                </q-input>
              </q-card-section>
            </q-card>
            <br />
            <div align="right">
              <q-btn
                no-caps
                unelevated
                color="primary"
                label="Log in"
                :loading="loading"
                @click="onLogin()"
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { required, email } from "vuelidate/lib/validators";
import Pageregister from "src/components/Pageregister";
export default {
  name: "Pagelogin",
  components: Pageregister,
  data() {
    return {
      loading: false,
      windLogin: false,
      formlogin: {
        email: "",
        password: "",
      },
    };
  },
  validations: {
    formlogin: {
      email: { required, email },
      password: { required },
    },
  },
  methods: {
    show() {
      this.$v.$reset();
      this.formlogin.email = "";
      this.formlogin.password = "";
      this.windRegister = false;
      this.$refs.dialog.show();
    },
    hide() {
      this.$refs.dialog.hide();
    },
    onDialogHide() {
      this.windLogin = false;
    },
    disRegister() {
      this.$refs.dialog.hide();
      this.$q.dialog({
        component: Pageregister,
      });
    },
    onLogin() {
      this.$v.formlogin.$touch();
      if (!this.$v.formlogin.$error) {
        this.loading = true;
        this.$store
          .dispatch("auth/login", this.formlogin)
          .then(() => {
            this.$q.notify({
              position: "top",
              color: "positive",
              textColor: "white",
              timeout: 2500,
              icon: "done",
              message: "Anda telah login!",
            });
            this.windLogin = false;
            this.$store.dispatch("carts/getcart", this.dataUser.id);
          })
          .catch((error) => {
            if (error.response) {
              this.$q.notify({
                position: "bottom-right",
                color: "negative",
                textColor: "white",
                timeout: 3500,
                icon: "error_outline",
                message: "Login gagal! Periksa Email atau Password!",
              });
            }
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
  },
};
</script>
