export default {
  legend: {
    default: {
      c: "STRUCTURE_CONTAINER",
      r: "STRUCTURE_ROAD",
      e: "STRUCTURE.EXTENSION",
      t: "STRUCTURE.TOWER",
      s: "STRUCTURE.STORAGE",
      S: "STRUCUTRE.SPAWN",
      t: "STRUCTURE.TERMINAL"
    }
  },
  default: {
    min: [5, 5],
    max: [7, 7],
    center: [3, 3],
    layout: [
      ' rerer ',
      ' errte ',
      ' erSre ',
      ' errre ',
      ' rerer '
    ]
  },
  testy: {
    Stage1: {
      "buildings": {
        "extension": {
          "pos": [{
            "x": 1,
            "y": 0
          }, {
            "x": 3,
            "y": 0
          }, {
            "x": 4,
            "y": 1
          }, {
            "x": 0,
            "y": 1
          }, {
            "x": 0,
            "y": 3
          }, {
            "x": 4,
            "y": 3
          }, {
            "x": 2,
            "y": 4
          }, {
            "x": 2,
            "y": 5
          }, {
            "x": 4,
            "y": 4
          }, {
            "x": 0,
            "y": 4
          }]
        },
        "road": {
          "pos": [{
            "x": 4,
            "y": 2
          }, {
            "x": 3,
            "y": 2
          }, {
            "x": 3,
            "y": 3
          }, {
            "x": 3,
            "y": 4
          }, {
            "x": 4,
            "y": 5
          }, {
            "x": 3,
            "y": 5
          }, {
            "x": 2,
            "y": 3
          }, {
            "x": 1,
            "y": 3
          }, {
            "x": 1,
            "y": 4
          }, {
            "x": 1,
            "y": 5
          }, {
            "x": 0,
            "y": 5
          }, {
            "x": 1,
            "y": 2
          }, {
            "x": 0,
            "y": 2
          }, {
            "x": 1,
            "y": 1
          }, {
            "x": 2,
            "y": 1
          }, {
            "x": 2,
            "y": 0
          }]
        },
        "tower": {
          "pos": [{
            "x": 3,
            "y": 1
          }]
        },
        "spawn": {
          "pos": [{
            "x": 2,
            "y": 2
          }]
        }
      }
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