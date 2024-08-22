<script setup>
import { ref } from 'vue'

const code = ref('')

const handleAuth = () => {
  if (!code.value) {
    return alert('Please enter a code')
  }

  if (code.value !== '3.1415926') {
    return alert('Invalid code')
  }

  window.sessionStorage.setItem('auth', code.value)
  window.location.reload()
}
</script>

<template>
  <div class="auth">
    <input type="password" placeholder="Code" v-model.trim="code" @keydown.enter="handleAuth" />
  </div>
</template>

<style scoped>
.auth {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: var(--background-color);
}

input {
  padding: 0.5rem;
  font-size: 1rem;
  text-align: center;
}
</style>
