import { Enum } from '@/enums/enum.js'

export const components = new Enum({
  layouts: [
    'userLayout',
    'basicLayout',
    'routeView',
    'blankLayout',
    'pageView'
  ],
  children: [
    'workplace',
    'users',
    'roles',
    'rules',
    'menu',
    'dict',
    'dictlist',
    'departments',
    'jobs',
    'database',
    'loginLog',
    'profile',
    'help',
    'modifyPassword',
    'log',
    'attachment',
    'file'
  ]
})
