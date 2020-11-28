export default {
  legend: {
    default: {
      c: "STRUCTURE.CONTAINER",
      r: "STRUCTURE.ROAD",
      e: "STRUCTURE.EXTENSION",
      t: "STRUCTURE.TOWER",
      s: "STRUCTURE.STORAGE",
      S: "STRUCUTRE.SPAWN",
      T: "STRUCTURE.TERMINAL"
    }
  },
  default: {
    min: 5,
    max: 7,
    layout: {
      0: ' reSer ',
      1: ' errte ',
      2: ' ersre ',
      3: ' erere ',
      4: ' rerer '
  }
  },
highwayX: {
    min: [3, 1],
    max: [7, 7],
    layout: [
      ' rrr ',
      ' rrr ',
      ' rrr '
    ]
  },
  highwayY: {
    min: [3, 3],
    max: [1, 3],
    layout: [
      ' rrr ',
      ' rrr ',
      ' rrr '
    ]
  },
  core: {
    min: [7, 7],
    max: [9, 9],
    layout: [
      '  r r  ',
      ' rspnr ',
      'rtSrTtr',
      ' rr rr ',
      'rtlrotr',
      ' rsrsr ',
      '  r r  '
    ]
  },
  lab: {
    min: [4, 4],
    max: [6, 6],
    layout: [
      '  rr  ',
      ' rllr ',
      'rllrlr',
      'rlrllr',
      ' rllr ',
      '  rr  '
    ]
  }
}