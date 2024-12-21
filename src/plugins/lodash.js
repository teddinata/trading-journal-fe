// src/plugins/lodash.js
import lodash from 'lodash'
import { default as Vue } from 'vue'

Vue.prototype._ = lodash
window._ = lodash

export default lodash