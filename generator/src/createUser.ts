import { createClient } from '@supabase/supabase-js'
import minimist from 'minimist'

require('dotenv').config()

if (!process.env.API_EXTERNAL_URL || !process.env.SERVICE_ROLE_KEY) {
  console.error('Не найдены переменные среды API_EXTERNAL_URL и SERVICE_ROLE_KEY')
  process.abort()
}

const argv = minimist(process.argv.slice(2))

const Supabase = createClient(
  process.env.API_EXTERNAL_URL,
  process.env.SERVICE_ROLE_KEY 
);

(async () => {
  const { error, data } = await Supabase.auth.admin.createUser({
    email: argv['email'],
    password: argv['password'],
    email_confirm: true
  })

  console.log(argv['password'])

  if (error) {
    console.error('Ошибка регистрации пользователя: ', error)
    return
  }
  console.log('Пользователь успешно создан!')
})()