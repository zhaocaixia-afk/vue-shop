import Vue from 'vue'

import format from 'date-fns/format'

Vue.filter('dateFormat',(value,formatStr='yyyy-MM-dd HH:mm:ss') => {
    return format(value,formatStr)
})
