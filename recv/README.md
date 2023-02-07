# Simple reciever for QuoteWind

Recieves data from supabase instance of QuoteWind and shows it in simple but appropriate way

## To begin with

`git clone this-repo`
`npm install`
`npm run build`

Put files from ./build to your web-server

## Config

Don't forget to set following ENV variables in .env:

`REACT_APP_SB_URL=http://your_ip:your_port`
URL to your QuoteWind Supabase instance

`REACT_APP_SB_KEY=your_key`
Anon key for your QuoteWind Supabase instance

`REACT_APP_DEFAULT_FONT_SIZE=60`
Font size to start from. Text will never be bigger than this size. In px.

`REACT_APP_MIN_FONT_SIZE=15`
Font size to end on. Text will never be smaller than this size. In px.
