# {{PRODUCT_NAME}}

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // Redirect to English homepage by default
  if (typeof window !== 'undefined') {
    window.location.href = '/en/'
  }
})
</script>

Redirecting to English documentation...

If not redirected, please visit [English Documentation](/en/) or [简体中文文档](/zh-hans/)
