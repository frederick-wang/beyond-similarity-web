// Classical Chinese quoted on the page, exactly as arXiv:2607.27595v1 prints
// it. Each text keeps the script of the edition it comes from: the Book of Han
// in traditional characters with its variant graph 逺 (U+903A) in the edict of
// Emperor Wu, the Records of the Three Kingdoms in simplified characters.
// Both language pages reference these by id, so a quotation is written once.

/** ISO 15924 script of the quoted edition; the page sets lang="zh-<script>" on the quotation. */
export type Script = 'Hant' | 'Hans'

export interface Quotation {
  readonly text: string
  readonly script: Script
}

export const quotationIds = [
  'charge',
  'wangMang',
  'jinAbdication',
  'patent',
  'diligent',
  'nearAndFar',
  'wuEdict',
  'rhapsody',
  'carriage',
  'xiangdangMounting',
  'xiangdangRiding',
  'zhangComposition',
  'zhangTransmission',
] as const
export type QuotationId = (typeof quotationIds)[number]

export const quotations = {
  // Analects 20, as transcribed in the Book of Han.
  charge: { text: '咨爾舜，天之歷數在爾躬', script: 'Hant' },
  // Book of Han, biography of Wang Mang.
  wangMang: { text: '歷數在于予躬', script: 'Hant' },
  // Records of the Three Kingdoms, abdication edict to Jin.
  jinAbdication: { text: '天禄永终，历数在晋', script: 'Hans' },
  // Book of Han, imperial patent appointing a commander.
  patent: { text: '往悉爾心，統辟元戎，折衝綏遠，匡正庶事，允執其中。', script: 'Hant' },
  // Analects, quoted in the Book of Han by a courtier defending the crown prince.
  diligent: { text: '敏而好學', script: 'Hant' },
  // Analects 13.
  nearAndFar: { text: '近者說，遠者來', script: 'Hant' },
  // Book of Han, edict of Emperor Wu.
  wuEdict: { text: '孔子對定公以徠逺', script: 'Hant' },
  // Book of Han, Ban Gu's rhapsody in the autobiographical postface.
  rhapsody: { text: '溺招路以從己兮', script: 'Hant' },
  // Book of Han, annals of Emperor Cheng.
  carriage: { text: '升車正立，不內顧，不疾言，不親指', script: 'Hant' },
  // Analects, "Xiangdang".
  xiangdangMounting: { text: '升車，必正立，執綏', script: 'Hant' },
  // Analects, "Xiangdang".
  xiangdangRiding: { text: '車中，不內顧，不疾言，不親指', script: 'Hant' },
  // Zhang Xuecheng, Wenshi tongyi, "Shuolin".
  zhangComposition: { text: '著作之體，援引古義，襲用成文，不標所出，非為掠美', script: 'Hant' },
  // Zhang Xuecheng, Wenshi tongyi, "Shuolin".
  zhangTransmission: { text: '司馬遷點竄尚書左國之文，班固點竄司馬遷之文，非好異也，理勢之不得不然也', script: 'Hant' },
} as const satisfies Readonly<Record<QuotationId, Quotation>>
