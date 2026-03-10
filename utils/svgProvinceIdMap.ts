/**
 * Maps SVG path ids from the vendored Iran provinces SVG to project en_name (route slug).
 * Source: nastoohir/iran-map-svg (path ids). Target: public/provinces.json en_name.
 */

export const SVG_PATH_ID_TO_EN_NAME: Record<string, string> = {
  alborz: 'alborz',
  ardabil: 'ardabil',
  'azerbaijan-east': 'east-azerbaijan',
  'azerbaijan-west': 'west-azerbaijan',
  bushehr: 'bushehr',
  'chaharmahal-bakhriari': 'chaharmahal-bakhtiari',
  fars: 'fars',
  gilan: 'gilan',
  golestan: 'golestan',
  hamadan: 'hamadan',
  hormozgan: 'hormozgan',
  ilam: 'ilam',
  isfahan: 'isfahan',
  kerman: 'kerman',
  kermanshah: 'kermanshah',
  'khorasan-north': 'north-khorasan',
  'khorasan-razavi': 'razavi-khorasan',
  'khorasan-south': 'south-khorasan',
  khuzestan: 'khuzestan',
  'kohgiluye-boyerahmad': 'kohgiluyeh-boyer-ahmad',
  kurdistan: 'kurdistan',
  lorestan: 'lorestan',
  markazi: 'markazi',
  mazandaran: 'mazandaran',
  qazvin: 'qazvin',
  qom: 'qom',
  semnan: 'semnan',
  'sistan-baluchestan': 'sistan-baluchestan',
  tehran: 'tehran',
  yazd: 'yazd',
  zanjan: 'zanjan',
}

export function svgPathIdToEnName(svgPathId: string): string | undefined {
  return SVG_PATH_ID_TO_EN_NAME[svgPathId]
}
