"use babel"

import path from 'path'
import Provider from '../lib/linter-annotations-provider'
fs = require('fs-plus')
temp = require('temp').track()

describe('Provider', () => {

  beforeEach(() => {
    waitsForPromise(() => atom.packages.activatePackage('linter-annotations'))
    waitsForPromise(() => atom.packages.activatePackage('language-javascript'))
    waitsForPromise(() => atom.packages.activatePackage('language-python'))
    waitsForPromise(() => atom.packages.activatePackage('language-ruby'))
    waitsForPromise(() => atom.packages.activatePackage('language-shellscript'))

    spyOn(atom.config, "load")
    spyOn(atom.config, "save")
    dotAtomPath = temp.path('atom-spec-config')
    atom.config.configDirPath = dotAtomPath
    atom.config.enablePersistence = true
    atom.config.configFilePath = path.join(atom.config.configDirPath, "atom.config.cson")
  })

  afterEach(() => {
    atom.config.enablePersistence = false
    fs.removeSync(dotAtomPath)
  })

  describe('capitalize()', () => {
    it('Should capitalize string', () => {
      expect(Provider.capitalize('fOO')).toEqual('Foo')
    })
  })

  describe('trim()', () => {
    it('Should trim string', () => {
      expect(Provider.trim('    foo    ')).toEqual('foo')
    })
  })

  describe('trimCommentEnd()', () => {
    it('Should strip comment endings', () => {
      expect(Provider.trimCommentEnd('/* test */')).toEqual('/* test')
      expect(Provider.trimCommentEnd('<%# test %>')).toEqual('<%# test')
    })
  })

  describe('lint()', () => {
    it('should return 7 messages in `fixture.js`', () => {
      waitsForPromise(() => {
        return atom.workspace.open(path.join(__dirname, 'files', 'fixture.js'))
          .then(editor => Provider.lint(editor))
          .then(messages => {
            expect(messages.length).toEqual(7)

            const errors = messages.filter(message => message.type === 'Error')
            expect(errors.length).toEqual(1)
            expect(errors[0].range).toEqual([[5, 3], [5, 38]])
            expect(errors[0].text).toEqual('FIXME: Something that has to be done')

            const warnings = messages.filter(message => message.type === 'Warning')
            expect(warnings.length).toEqual(5)
            expect(warnings[0].range).toEqual([[6, 3], [6, 37]])
            expect(warnings[0].text).toEqual('TODO: Something that should be done')

            expect(warnings[1].range).toEqual([[7, 3], [7, 38]])
            expect(warnings[1].text).toEqual('TODO: Something that should be done')

            expect(warnings[2].range).toEqual([[8, 3], [8, 39]])
            expect(warnings[2].text).toEqual('TODO: Something that should be done')

            expect(warnings[3].range).toEqual([[9, 3], [9, 38]])
            expect(warnings[3].text).toEqual('TODO: Something that should be done')

            expect(warnings[4].range).toEqual([[10, 3], [10, 7]])
            expect(warnings[4].text).toEqual('TODO')

            const infos = messages.filter(message => message.type === 'Info')
            expect(infos.length).toEqual(1)
            expect(infos[0].range).toEqual([[4, 3], [4, 30]])
            expect(infos[0].text).toEqual('NOTE: Something good to know')
          })
      })
    })

    it('should return 1 messages in `fixture.erb`', () => {
      waitsForPromise(() => {
        return atom.workspace.open(path.join(__dirname, 'files', 'fixture.erb'))
          .then(editor => Provider.lint(editor))
          .then(messages => {
            expect(messages.length).toEqual(1)

            const warnings = messages.filter(message => message.type === 'Warning')
            expect(warnings.length).toEqual(1)
            expect(warnings[0].range).toEqual([[1, 4], [1, 22]])
            expect(warnings[0].text).toEqual('TODO: Do something')
          })
      })
    })

    it('should return 84 messages in `fixture.py`', () => {
      waitsForPromise(() => {
        return atom.workspace.open(path.join(__dirname, 'files', 'fixture.py'))
          .then(editor => Provider.lint(editor))
          .then(messages => {
            expect(messages.length).toEqual(84)
            const warnings = messages.filter(message => message.type === 'Warning')
            const textAA = messages.filter(message => message.text === 'TODO: AA')
            const textEmpty = messages.filter(message => message.text === 'TODO')
            expect(warnings.length).toEqual(84)
            expect(textEmpty.length).toEqual(30)
            expect(textAA.length).toEqual(54)
            expect(warnings[0].range).toEqual([[1, 5], [1, 9]])
            expect(warnings[1].range).toEqual([[2, 5], [2, 10]])
            expect(warnings[2].range).toEqual([[5, 1], [5, 5]])
            expect(warnings[3].range).toEqual([[6, 1], [6, 6]])
            expect(warnings[4].range).toEqual([[7, 2], [7, 6]])
            expect(warnings[5].range).toEqual([[8, 2], [8, 7]])
            expect(warnings[6].range).toEqual([[9, 3], [9, 7]])
            expect(warnings[7].range).toEqual([[10, 3], [10, 8]])
            expect(warnings[8].range).toEqual([[11, 3], [11, 7]])
            expect(warnings[9].range).toEqual([[12, 3], [12, 8]])
            expect(warnings[10].range).toEqual([[13, 5], [13, 9]])
            expect(warnings[11].range).toEqual([[14, 5], [14, 10]])
            expect(warnings[12].range).toEqual([[15, 4], [15, 8]])
            expect(warnings[13].range).toEqual([[16, 4], [16, 9]])
            expect(warnings[14].range).toEqual([[17, 7], [17, 11]])
            expect(warnings[15].range).toEqual([[18, 7], [18, 12]])
            expect(warnings[16].range).toEqual([[19, 1], [19, 8]])
            expect(warnings[17].range).toEqual([[20, 2], [20, 9]])
            expect(warnings[18].range).toEqual([[21, 3], [21, 10]])
            expect(warnings[19].range).toEqual([[22, 2], [22, 9]])
            expect(warnings[20].range).toEqual([[23, 3], [23, 10]])
            expect(warnings[21].range).toEqual([[24, 4], [24, 11]])
            expect(warnings[22].range).toEqual([[25, 3], [25, 10]])
            expect(warnings[23].range).toEqual([[26, 4], [26, 11]])
            expect(warnings[24].range).toEqual([[27, 5], [27, 12]])
            expect(warnings[25].range).toEqual([[28, 1], [28, 9]])
            expect(warnings[26].range).toEqual([[29, 2], [29, 10]])
            expect(warnings[27].range).toEqual([[30, 3], [30, 11]])
            expect(warnings[28].range).toEqual([[31, 2], [31, 10]])
            expect(warnings[29].range).toEqual([[32, 3], [32, 11]])
            expect(warnings[30].range).toEqual([[33, 4], [33, 12]])
            expect(warnings[31].range).toEqual([[34, 3], [34, 11]])
            expect(warnings[32].range).toEqual([[35, 4], [35, 12]])
            expect(warnings[33].range).toEqual([[36, 5], [36, 13]])
            expect(warnings[34].range).toEqual([[37, 1], [37, 6]])
            expect(warnings[35].range).toEqual([[38, 2], [38, 7]])
            expect(warnings[36].range).toEqual([[39, 3], [39, 8]])
            expect(warnings[37].range).toEqual([[40, 3], [40, 8]])
            expect(warnings[38].range).toEqual([[41, 5], [41, 10]])
            expect(warnings[39].range).toEqual([[42, 4], [42, 9]])
            expect(warnings[40].range).toEqual([[43, 7], [43, 12]])
            expect(warnings[41].range).toEqual([[44, 1], [44, 9]])
            expect(warnings[42].range).toEqual([[45, 2], [45, 10]])
            expect(warnings[43].range).toEqual([[46, 3], [46, 11]])
            expect(warnings[44].range).toEqual([[47, 2], [47, 10]])
            expect(warnings[45].range).toEqual([[48, 3], [48, 11]])
            expect(warnings[46].range).toEqual([[49, 4], [49, 12]])
            expect(warnings[47].range).toEqual([[50, 3], [50, 11]])
            expect(warnings[48].range).toEqual([[51, 4], [51, 12]])
            expect(warnings[49].range).toEqual([[52, 5], [52, 13]])
            expect(warnings[50].range).toEqual([[53, 1], [53, 10]])
            expect(warnings[51].range).toEqual([[54, 2], [54, 11]])
            expect(warnings[52].range).toEqual([[55, 3], [55, 12]])
            expect(warnings[53].range).toEqual([[56, 2], [56, 11]])
            expect(warnings[54].range).toEqual([[57, 3], [57, 12]])
            expect(warnings[55].range).toEqual([[58, 4], [58, 13]])
            expect(warnings[56].range).toEqual([[59, 3], [59, 12]])
            expect(warnings[57].range).toEqual([[60, 4], [60, 13]])
            expect(warnings[58].range).toEqual([[61, 5], [61, 14]])
            expect(warnings[59].range).toEqual([[62, 1], [62, 6]])
            expect(warnings[60].range).toEqual([[63, 2], [63, 7]])
            expect(warnings[61].range).toEqual([[64, 3], [64, 8]])
            expect(warnings[62].range).toEqual([[65, 3], [65, 8]])
            expect(warnings[63].range).toEqual([[66, 5], [66, 10]])
            expect(warnings[64].range).toEqual([[67, 4], [67, 9]])
            expect(warnings[65].range).toEqual([[68, 7], [68, 12]])
            expect(warnings[66].range).toEqual([[69, 1], [69, 9]])
            expect(warnings[67].range).toEqual([[70, 2], [70, 10]])
            expect(warnings[68].range).toEqual([[71, 3], [71, 11]])
            expect(warnings[69].range).toEqual([[72, 2], [72, 10]])
            expect(warnings[70].range).toEqual([[73, 3], [73, 11]])
            expect(warnings[71].range).toEqual([[74, 4], [74, 12]])
            expect(warnings[72].range).toEqual([[75, 3], [75, 11]])
            expect(warnings[73].range).toEqual([[76, 4], [76, 12]])
            expect(warnings[74].range).toEqual([[77, 5], [77, 13]])
            expect(warnings[75].range).toEqual([[78, 1], [78, 12]])
            expect(warnings[76].range).toEqual([[79, 2], [79, 13]])
            expect(warnings[77].range).toEqual([[80, 3], [80, 14]])
            expect(warnings[78].range).toEqual([[81, 2], [81, 13]])
            expect(warnings[79].range).toEqual([[82, 3], [82, 14]])
            expect(warnings[80].range).toEqual([[83, 4], [83, 15]])
            expect(warnings[81].range).toEqual([[84, 3], [84, 14]])
            expect(warnings[82].range).toEqual([[85, 4], [85, 15]])
            expect(warnings[83].range).toEqual([[86, 5], [86, 16]])

            expect(textAA[0].range).toEqual([[19, 1], [19, 8]])

            expect(textEmpty[0].range).toEqual([[1, 5], [1, 9]])
          })
      })
    })

    it('should return 3 messages in `fixture.sh`', () => {
      waitsForPromise(() => {
        return atom.workspace.open(path.join(__dirname, 'files', 'fixture.sh'))
          .then(editor => Provider.lint(editor))
          .then(messages => {
            expect(messages.length).toEqual(3)

            expect(messages[0].type).toEqual("Error")
            expect(messages[0].text).toEqual("FIXME: This FIXME is visible")
            expect(messages[0].range).toEqual([[1, 1], [1, 29]])

            expect(messages[1].type).toEqual("Error")
            expect(messages[1].text).toEqual("FIXME: This FIXME is visible")
            expect(messages[1].range).toEqual([[4, 3], [4, 31]])

            expect(messages[2].type).toEqual("Warning")
            expect(messages[2].text).toEqual("TODO: This TODO is visible")
            expect(messages[2].range).toEqual([[5, 3], [5, 29]])
          })
      })
    })
  })
})
