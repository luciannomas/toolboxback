const { expect } = require('chai')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

// Bajo nivel: test de fetchJson y fetchCsv con mock de https
describe('filesService - bajo nivel (https mock)', () => {
  let httpsMock, filesService

  beforeEach(() => {
    httpsMock = { get: sinon.stub() }
    filesService = proxyquire('../../services/filesService', { https: httpsMock })
  })

  afterEach(() => sinon.restore())

  it('fetchJson - éxito', async () => {
    const fakeRes = {
      on: (event, cb) => {
        if (event === 'data') cb('{"files":["file1.csv"]}')
        if (event === 'end') cb()
        return fakeRes
      }
    }
    httpsMock.get.callsFake((url, opts, cb) => { cb(fakeRes); return { on: () => {} } })
    const result = await filesService.fetchJson('https://fake-url')
    expect(result).to.deep.equal({ files: ['file1.csv'] })
  })

  it('fetchJson - error JSON', async () => {
    const fakeRes = {
      on: (event, cb) => {
        if (event === 'data') cb('not json')
        if (event === 'end') cb()
        return fakeRes
      }
    }
    httpsMock.get.callsFake((url, opts, cb) => { cb(fakeRes); return { on: () => {} } })
    try {
      await filesService.fetchJson('https://fake-url')
    } catch (err) {
      expect(err).to.be.instanceOf(Error)
      return
    }
    throw new Error('No debería llegar aquí')
  })

  it('fetchCsv - éxito', async () => {
    const fakeRes = {
      on: (event, cb) => {
        if (event === 'data') cb('file1.csv,text,number,hex\nfile1.csv,abc,123,abcdef')
        if (event === 'end') cb()
        return fakeRes
      }
    }
    httpsMock.get.callsFake((url, opts, cb) => { cb(fakeRes); return { on: () => {} } })
    const result = await filesService.fetchCsv('https://fake-url')
    expect(result).to.equal('file1.csv,text,number,hex\nfile1.csv,abc,123,abcdef')
  })

  it('parseCsv - solo header, sin datos', () => {
    const filesService = proxyquire('../../services/filesService', { https: {} })
    const csv = 'file1.csv,text,number,hex' // solo header
    const result = filesService.parseCsv(csv, 'file1.csv')
    expect(result).to.deep.equal([])
  })

  it('parseCsv - línea con columnas incompletas', () => {
    const filesService = proxyquire('../../services/filesService', { https: {} })
    const csv = 'file1.csv,text,number,hex\nfile1.csv,abc,123' // falta la columna hex
    const result = filesService.parseCsv(csv, 'file1.csv')
    expect(result).to.deep.equal([])
  })

  it('parseCsv - línea con nombre de archivo incorrecto', () => {
    const filesService = proxyquire('../../services/filesService', { https: {} })
    const csv = 'file1.csv,text,number,hex\nfile2.csv,abc,123,abcdef' // file2.csv no coincide
    const result = filesService.parseCsv(csv, 'file1.csv')
    expect(result).to.deep.equal([])
  })

  it('parseCsv - línea válida', () => {
    const filesService = proxyquire('../../services/filesService', { https: {} })
    const csv = 'file1.csv,text,number,hex\nfile1.csv,abc,123,abcdef'
    const result = filesService.parseCsv(csv, 'file1.csv')
    expect(result).to.deep.equal([
      { text: 'abc', number: 123, hex: 'abcdef' }
    ])
  })

  it('parseCsv - varias líneas válidas', () => {
    const filesService = proxyquire('../../services/filesService', { https: {} })
    const csv = 'file1.csv,text,number,hex\nfile1.csv,abc,123,abcdef\nfile1.csv,def,456,123456'
    const result = filesService.parseCsv(csv, 'file1.csv')
    expect(result).to.deep.equal([
      { text: 'abc', number: 123, hex: 'abcdef' },
      { text: 'def', number: 456, hex: '123456' }
    ])
  })

  it('parseCsv - header incorrecto (menos de 4 columnas)', () => {
    const filesService = proxyquire('../../services/filesService', { https: {} })
    const csv = 'file1.csv,text,number\nfile1.csv,abc,123' // header incompleto
    const result = filesService.parseCsv(csv, 'file1.csv')
    expect(result).to.deep.equal([])
  })
})
