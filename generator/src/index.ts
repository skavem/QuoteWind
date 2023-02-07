import fs from 'fs'
import { PrismaClient } from "@prisma/client";

type Book = {
  name: string,
  fullName: string
  content: string[][]
}
type Bible = Book[]

type Couplet = {
  name: string,
  text: string
}
type Song = {
  name: string,
  number: number,
  couplets: Couplet[]
}

const tableToRealtime = async (prisma: PrismaClient, tableName: string) => {
  return await prisma.$executeRawUnsafe(`ALTER PUBLICATION supabase_realtime ADD TABLE public."${tableName}"` )
}

const rlsToTable = async (prisma: PrismaClient, tableName: string) => {
  const enableRls = `ALTER TABLE public."${tableName}" ENABLE ROW LEVEL SECURITY`
  const policies = [`
    CREATE POLICY "Enable read access for all users"
    ON public."${tableName}"
    FOR SELECT 
    USING (true)`, 

    `CREATE POLICY "Enable insert for authenticated users only"
    ON public."${tableName}"
    FOR INSERT 
    TO authenticated 
    WITH CHECK (true)`,

    `CREATE POLICY "Enable update for authenticated users only"
    ON public."${tableName}"
    FOR UPDATE 
    TO authenticated 
    USING (true)
    WITH CHECK (true)`,

    `CREATE POLICY "Enable delete for authenticated users only"
    ON public."${tableName}"
    FOR DELETE 
    TO authenticated 
    USING (true)`
  ]

  await prisma.$executeRawUnsafe(enableRls)
  await Promise.all(policies.map(async policy => await prisma.$executeRawUnsafe(policy)))
}

const setupState = async (prisma: PrismaClient) => {
  const tableName = 'State'
  const onInsertFunc = `
    CREATE OR REPLACE FUNCTION state_insert_trigger()
    RETURNS TRIGGER AS $$
    BEGIN
      IF (SELECT COUNT(*) FROM public."${tableName}") > 0 THEN
        DELETE FROM public."${tableName}" WHERE id = 1;
        RETURN NEW;
      END IF;
    END;
    $$ LANGUAGE plpgsql
  `
  const onInsertTrigger = `
    CREATE TRIGGER state_insert_trg
    BEFORE INSERT ON public."${tableName}"
    FOR EACH ROW
    EXECUTE PROCEDURE state_insert_trigger()
  `

  const onDeleteFunc = `
    CREATE OR REPLACE FUNCTION state_delete_trigger()
    RETURNS TRIGGER AS $$
    BEGIN
      IF (SELECT COUNT(*) FROM public."${tableName}") > 0 THEN
        RAISE EXCEPTION 'You can only alter row with id = 1 for this table';
      END IF;
      RETURN OLD;
    END;
    $$ LANGUAGE plpgsql
  `
  const onDeleteTrigger = `
    CREATE TRIGGER state_delete_trg
    BEFORE DELETE ON public."${tableName}"
    FOR EACH ROW
    EXECUTE PROCEDURE state_delete_trigger();
  `

  await prisma.$executeRawUnsafe(onInsertFunc)
  await prisma.$executeRawUnsafe(onInsertTrigger)
  await prisma.$executeRawUnsafe(onDeleteFunc)
  await prisma.$executeRawUnsafe(onDeleteTrigger)
}

(async () => {
  const prisma = new PrismaClient()

  const Bible = JSON.parse(fs.readFileSync('./data/Bible.json').toString()) as Bible
  await Promise.all(Bible.map(async (book, bookIndex) => {
    const { id: bookId } = await prisma.book.create({
      data: {
        full_name: book.fullName,
        index: bookIndex,
        name: book.name
      }
    })

    await Promise.all(book.content.map(async (chapter, chapterIndex) => {
      await prisma.chapter.create({
        data: {
          index: chapterIndex,
          book_id: bookId,
          Verse: {
            createMany: {
              data: chapter.map((verse, verseIndex) => ({index: verseIndex, text: verse}))
            }
          }
        }
      })
    }))
  }))

  const songs = JSON.parse(fs.readFileSync('./data/songs.json').toString()) as Song[]
  await Promise.all(songs.map(async song => {
    const { couplets } = song.couplets.reduce((prev: { chorus: Couplet | null, couplets: Couplet[] }, couplet, curInd) => {
      prev.couplets.push(couplet)
      if (couplet.name !== 'Припев' && prev.chorus) {
        prev.couplets.push(prev.chorus)
      }
      if (couplet.name === 'Припев') {
        prev.chorus = couplet
      }

      return prev
    }, { chorus: null, couplets: [] })

    await prisma.song.create({
      data: {
        label: song.number.toString(),
        name: song.name,
        Couplet: {
          createMany: {
            data: couplets.map((couplet, index) => ({
              index,
              label: couplet.name,
              text: couplet.text
            }))
          }
        }
      }
    })
  }))

  await prisma.state.create({
    data: {
      styles: {
        qr: {
          data: 'https://sberbank.ru/qr/uuid=1000093621',
          shown: false,
          size: 50,
          bgColor: '#000000F2',
          fgColor: '#FFFFFFFF'
        },
        couplet: {
          lineHeight: 1,
          backgroundColor: '#000000F2',
          color: '#FFFFFFFF'
        },
        verse: {
          lineHeight: 1,
          backgroundColor: '#000000F2',
          color: '#FFFFFFFF'
        }
      },
    }
  });

  await Promise.all(['Song', 'Couplet', 'Book', 'Chapter', 'Verse', 'State'].map(async tableName => {
    await rlsToTable(prisma, tableName)
  }));

  await Promise.all(['Song', 'Couplet', 'State'].map(async tableName => {
    await tableToRealtime(prisma, tableName)  
  }));

  await setupState(prisma)

  await prisma.$disconnect()
})()