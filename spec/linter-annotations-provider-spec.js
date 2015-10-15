"use babel"

import Provider from '../lib/linter-annotations-provider'

describe('Provider', () => {

  beforeEach(() => {
    waitsForPromise(() => atom.packages.activatePackage('linter-annotations'))
    waitsForPromise(() => atom.packages.activatePackage('language-javascript'))
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


  describe('lint()', () => {
    it('should retuns 3 messages', () => {
      waitsForPromise(() => {
        return atom.workspace.open('./files/fixture.js')
          .then(editor => Provider.lint(editor))
          .then(messages => {
            expect(messages.length).toEqual(3)

            const errors = messages.filter(message => message.type === 'Error')
            expect(errors.length).toEqual(1)
            expect(errors[0].range).toEqual([[4, 3], [4, 38]])
            expect(errors[0].text).toEqual('FIXME: Something that has to be done')

            const warnings = messages.filter(message => message.type === 'Warning')
            expect(warnings.length).toEqual(1)
            expect(warnings[0].range).toEqual([[5, 3], [5, 37]])
            expect(warnings[0].text).toEqual('TODO: Something that should be done')

            const infos = messages.filter(message => message.type === 'Info')
            expect(infos.length).toEqual(1)
            expect(infos[0].range).toEqual([[6, 3], [6, 30]])
            expect(infos[0].text).toEqual('NOTE: Something good to know')
          })
      })
    })
  })
})
