# QuoteWind 💨 - альтернатива VisioBible, основанная на веб
**QuoteWind** (с англ.: ветер цитат) - свободная альтернатива давно не обновлявшейся VisioBible - программы для отображения цитат из Библии и песен на втором мониторе.

## Преимущества
💪 Нет необходимости во втором мониторе

💪 Нативно интегрируется в любую стриминговую программу с возможностью отображения веб-страниц

💪 Легко дополнять своими решениями

💪 Не зависит от платформы (Независимые решения можно собирать для любой платформы, поддерживающей [Docker](https://github.com/docker-library/official-images#architectures-other-than-amd64))

## Установка
1. Установить [Docker](https://docs.docker.com/get-docker), [Node](https://nodejs.org) и [Git](https://docs.github.com/ru/get-started/quickstart/set-up-git)

2. Загрузить этот репозиторий:

```
git clone https://github.com/skavem/QuoteWind
```

3. [Запустить инстанс Supabase](https://github.com/skavem/QuoteWind#%D1%81%D0%BE%D0%B1%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9-%D0%B8%D0%BD%D1%81%D1%82%D0%B0%D0%BD%D1%81-%D0%B8%D0%BB%D0%B8-%D1%83%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9)

4. Запустить компоненты

Если сервер хранится **локально**:
```
rebuild.bat
```

Если сервер хранится **удаленно**:
```
docker run --name quotewind-recv $(docker build -t quotewind/recv -q --rm .\recv\)
docker run --name quotewind-frontend $(docker build -t quotewind/frontend -q --rm .\frontend\)
```

5. Подготовить и наполнить БД:

```
cd ./QuoteWind/generator
# Обратите внимание на последнюю строчку следующей команды - необходимо изменить сгенерированную миграцию вручную
npm ci
npm run prepare
npm run migrate
npm run fill
# Создать пользователя. Необязательно, чтобы почта была существующей
npm run createuser -- --email [почта] --password [пароль]
cd ..
```

6. Приступать к работе

Управление отображением будет доступно по адресу http://localhost:8010. Если указывали IP в переменной SITE_URL, то http://SITE_URL:8010.

Аналогично доступно отображение - но на порте 8020.

## Собственный инстанс или удаленный?
Поскольку в качестве бэкенда QuoteWind использует [Supabase](https://supabase.com/), его можно запустить двумя способами:

### 1. Использовать бесплатный удаленный севрер от Supabase.
* Этот способ переносит всю нагрузку на удаленную машину.
* Требуется интернет.
* Не требует памяти.

### 2. Запустить сервер на своем устройстве;
* Этот способ дает свободу в обращении с подлежащей БД и другими компонентами.
* Не требует интернета (кроме локальной сети, если нужно запустить компонент на другом устройстве).
* Требует много памяти (10 Gb ROM, 2 Gb RAM)

Предполагается, что действия выполняются в данном репозитории. Для реализации нужно:

1. [Сгенерировать ключи](https://supabase.com/docs/guides/self-hosting#api-keys) ANON_KEY и SERVICE_KEY, также надо скопировать поле JWT secret

2. Скопировать эти файлы и переименовать, убрав `.example`:
```
./.env.example
./backend/volumes/api/kong.yml.example
``` 

3. Вставить ключи из шага 1 в следующие файлы:
- `./.env`:
  - ANON_KEY - ANON_KEY
  - SERVICE_ROLE_KEY - SERVICE_KEY
- `./backend/volumes/api/kong.yml`:
  - anon в поле key - ANON_KEY
  - service_role в поле key - SERVICE_KEY
  
4. Обновить секреты в `./.env` файле:
POSTGRES_PASSWORD: пароль для БД.

JWT_SECRET: JWT secret, полуенный на 1 шаге.

SITE_URL: адрес сайта (например, на том же ПК `http://localhost`)

Необходимо скопировать те же данные, что при запуске на своем устройстве, со страницы проекта, и вставить их в `./.env`.

## Почему веб 🕸️?
Такая структура позволяет быть проекту быть гибким. 

Например, recv можно использовать не только в OBS, но и в других стриминговых программах. 

А можно и вовсе разработать свой, позволив людям подключаться к трансляции текста с телефона (в браузере).