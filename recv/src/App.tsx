import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Transition } from 'react-transition-group';
import { createClient } from '@supabase/supabase-js'
import styles from './App.module.css'

import { Database } from './types/supabase'
import { QRCodeSVG } from 'qrcode.react';

type DBTables = Database['public']['Tables']
type StateRow = DBTables['State']['Row']
type QrStyles = {
  data?: string,
  shown?: boolean,
  size?: number,
  bgColor?: string,
  fgColor?: string
}
type CoupletStyles = {
  lineHeight?: number,
  backgroundColor?: string,
  color?: string
}
type VerseStyles = {
  lineHeight?: number,
  backgroundColor?: string,
  color?: string
}

const getVerseById = async (id: DBTables['Verse']['Row']['id'] | null) => {
  if (!id) return null
  const { data: verse } = await supabase
    .from('Verse')
    .select('text, index, chapter:chapter_id ( index, book:book_id ( name ) )')
    .eq('id', id)
    .single()

  if (!verse) return null
  const chapter = verse.chapter

  if (!chapter) return null
  const book: { name: string } = Array.isArray(chapter) 
    ? chapter[0].book as { name: string }
    : chapter.book as { name: string }
  const chapterIndex: number = Array.isArray(chapter) 
    ? chapter[0].index as number 
    : chapter.index as number

  return {
    text: verse.text,
    reference: `${book.name} ${chapterIndex}:${verse.index}`
  }
}
const getCoupletById = async (
  id: DBTables['Couplet']['Row']['id'] | null
) => {
  if (!id) return null
  const { data } = await supabase
    .from('Couplet')
    .select()
    .eq('id', id)
    .single()
  return data
}

const getCurrentState = async () => {
  const { data } = await supabase
    .from('State')
    .select()
    .single()

  return data
}

const supabase = createClient<Database>(
  process.env.REACT_APP_SB_URL!, 
  process.env.REACT_APP_SB_KEY!
)

const concatClasses = (...classes: string[]) => classes.join(' ')

type resizeElProps = {
  el: HTMLDivElement,
  start?: number,
  end?: number,
  partOfScreenToFitInto?: number
}
const resizeEl = ({
  el,
  start = +(process.env.REACT_APP_MIN_FONT_SIZE ?? 15),
  end = +(process.env.REACT_APP_DEFAULT_FONT_SIZE ?? 60),
  partOfScreenToFitInto = 0.5
}: resizeElProps) => {
  console.log({start, end, el})

  if (Math.abs(start - end) < 0.01) return start
  
  let size = start + (end - start) / 2

  el.style.fontSize = `${size}px`

  console.log(el.scrollHeight, window.innerHeight)

  if (el.scrollHeight < window.innerHeight * partOfScreenToFitInto) {
    size = resizeEl({ el, start: size, end, partOfScreenToFitInto })!
  } else {
    size = resizeEl({ el, start, end: size, partOfScreenToFitInto })!
  }
  el.style.fontSize = `${size}px`
  return size
}

const duration = 1000;
const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
}
const transitionStyles: { [key: string]: React.CSSProperties } = {
  entering: { opacity: 1 },
  entered:  { opacity: 1 },
  exiting:  { opacity: 0 },
  exited:   { opacity: 0 },
}

const useDebounce = <T,>(value: T, timeout: number = 300) => {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(value)
    }, timeout)

    return () => {
      clearTimeout(handler)
    }
  }, [value, timeout])

  return debounced
}

function App() {
  const [verseText, setVerseText] = useState('')
  const [reference, setReference] = useState('')
  const [coupletText, setCoupletText] = useState('')

  const [qr, setQr] = useState<QrStyles | null>(null)
  const [coupletStyles, setCoupletStyles] = useState<CoupletStyles | null>(null)
  const [verseStyles, setVerseStyles] = useState<VerseStyles | null>(null)

  const debouncedVerseText = useDebounce(verseText, duration)
  const debouncedCoupletText = useDebounce(coupletText, duration)
  const debouncedReference = useDebounce(reference, duration)
  
  const resizeRef = useRef<HTMLDivElement | null>(null)
  const transitionRef = useRef<HTMLDivElement | null>(null)

  const onRemoteStateChange = useCallback(async (
    state: StateRow
  ) => {
    const verse = await getVerseById(state.verse_id)
    setVerseText(verse ? verse.text : '')
    setReference(verse ? verse.reference : '')

    const couplet = await getCoupletById(state.couplet_id)
    setCoupletText(couplet ? (couplet.text ?? '').trim() : '')

    const styles = state.styles 
    if (styles && typeof styles === 'object' && !Array.isArray(styles)) {
      if (styles.qr) {
        setQr(styles.qr as QrStyles)
      }
      if (styles.couplet) {
        setCoupletStyles(styles.couplet as CoupletStyles)
      }
      setVerseStyles(styles.verse as VerseStyles ?? null)
    }
  }, [setVerseText, setCoupletText, setReference, setQr])

  useEffect(() => {
    getCurrentState().then(async state => {
      if (!state) return
      onRemoteStateChange(state)
    })

    const subscription = supabase
      .channel('public:State')
      .on<StateRow>(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'State'},
        payload => onRemoteStateChange(payload.new)
      )
      .subscribe()
  
    return () => {
      subscription.unsubscribe()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!resizeRef.current  || (coupletText === '' && verseText === '')) return
    const el = resizeRef.current
    const partOfScreenToFitInto = coupletText ? 0.9 : 0.5
    resizeEl({ el, partOfScreenToFitInto, end: 120 })
  }, [verseText, coupletText, debouncedCoupletText, debouncedVerseText, qr])

  return (
    <div className={styles['ViewPort']}>
      <Transition
        in={!!(coupletText || verseText)}
        nodeRef={transitionRef}
        timeout={{ enter: duration, exit: duration }}
      >
        {state => (
          <div
            ref={(el) => {
              if (!coupletText) {
                resizeRef.current = el
              }
              transitionRef.current = el 
            }}
            className={concatClasses(
              styles['ViewPort--Item'],
              styles[
                coupletText || debouncedCoupletText 
                  ? 'ViewPort--Couplet' 
                  : (verseText || debouncedVerseText ? 'ViewPort--Verse' : '')
              ]
            )}
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
              ...(
                (verseText || debouncedVerseText) && verseStyles 
                  ? verseStyles 
                  : {}
              ),
              ...(
                (coupletText || debouncedCoupletText) && coupletStyles 
                  ? coupletStyles 
                  : {}
              ),
            }}
          >
            {
              coupletText || debouncedCoupletText
                ? (
                    <div
                      style={{}}
                      ref={resizeRef}
                    >
                      {coupletText || debouncedCoupletText}
                      <br></br>
                      {qr && qr.shown ?
                        <QRCodeSVG
                          value={qr.data ?? 'data'}
                          size={qr.size ? qr.size / 100 * window.innerHeight : 128}
                          fgColor={qr.fgColor ?? 'white'}
                          bgColor={qr.bgColor ?? 'black'}
                          style={{marginTop: '0.25em', borderRadius: '20px'}}
                          includeMargin
                        /> :
                        <></>
                      }
                    </div>
                  ) 
                : (
                    <>
                      {verseText || debouncedVerseText}
                      <div
                        className={styles['Verse--Reference']}
                      >
                        {reference || debouncedReference}
                      </div>
                    </>
                  )
            }
          </div>
        )}
      </Transition>
    </div>
  )
}

export default App
