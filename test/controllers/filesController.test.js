const { expect } = require('chai')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

function mockRes () {
  return {
    statusCode: 200,
    body: null,
    status (code) { this.statusCode = code; return this },
    json (data) { this.body = data }
  }
}

describe('filesController', () => {
  let filesServiceMock, filesController

  beforeEach(() => {
    filesServiceMock = {
      getFilesData: sinon.stub(),
      getFilesList: sinon.stub()
    }
    filesController = proxyquire('../../controllers/filesController', {
      '../services/filesService': filesServiceMock
    })
  })

  afterEach(() => sinon.restore())

  describe('filesDataHandler', () => {
    it('debe responder con los datos del archivo (éxito)', async () => {
      const mockData = [{ file: 'file1.csv', lines: [{ text: 'abc', number: 123, hex: 'abcdef' }] }]
      filesServiceMock.getFilesData.resolves(mockData)
      const req = { query: { fileName: 'file1.csv' } }
      const res = mockRes()
      await filesController.filesDataHandler(req, res)
      expect(filesServiceMock.getFilesData.calledOnceWith('file1.csv')).to.be.true
      expect(res.body).to.deep.equal(mockData)
    })

    it('debe responder con error 500 si falla el servicio', async () => {
      filesServiceMock.getFilesData.rejects(new Error('fail'))
      const req = { query: { fileName: 'file1.csv' } }
      const res = mockRes()
      await filesController.filesDataHandler(req, res)
      expect(filesServiceMock.getFilesData.calledOnceWith('file1.csv')).to.be.true
      expect(res.statusCode).to.equal(500)
      expect(res.body).to.deep.equal({ error: 'Failed to fetch files' })
    })

    it('debe responder con los datos del archivo (sin fileName)', async () => {
      const mockData = [
        { file: 'file1.csv', lines: [{ text: 'abc', number: 123, hex: 'abcdef' }] },
        { file: 'file2.csv', lines: [{ text: 'def', number: 456, hex: '123456' }] }
      ]
      filesServiceMock.getFilesData.resolves(mockData)
      const req = { query: {} } // sin fileName
      const res = mockRes()
      await filesController.filesDataHandler(req, res)
      expect(filesServiceMock.getFilesData.calledOnceWithExactly(undefined)).to.be.true
      expect(res.body).to.deep.equal(mockData)
    })

    it('debe responder con un array vacío si no hay datos', async () => {
      filesServiceMock.getFilesData.resolves([])
      const req = { query: { fileName: 'file1.csv' } }
      const res = mockRes()
      await filesController.filesDataHandler(req, res)
      expect(filesServiceMock.getFilesData.calledOnceWith('file1.csv')).to.be.true
      expect(res.body).to.deep.equal([])
    })
  })

  describe('filesListHandler', () => {
    it('debe responder con la lista de archivos (éxito)', async () => {
      filesServiceMock.getFilesList.resolves(['file1.csv', 'file2.csv'])
      const req = {}
      const res = mockRes()
      await filesController.filesListHandler(req, res)
      expect(filesServiceMock.getFilesList.calledOnce).to.be.true
      expect(res.body).to.deep.equal({ files: ['file1.csv', 'file2.csv'] })
    })

    it('debe responder con error 500 si falla el servicio', async () => {
      filesServiceMock.getFilesList.rejects(new Error('fail'))
      const req = {}
      const res = mockRes()
      await filesController.filesListHandler(req, res)
      expect(filesServiceMock.getFilesList.calledOnce).to.be.true
      expect(res.statusCode).to.equal(500)
      expect(res.body).to.deep.equal({ error: 'Failed to fetch files list' })
    })

    it('debe responder con un array vacío si no hay archivos', async () => {
      filesServiceMock.getFilesList.resolves([])
      const req = {}
      const res = mockRes()
      await filesController.filesListHandler(req, res)
      expect(filesServiceMock.getFilesList.calledOnce).to.be.true
      expect(res.body).to.deep.equal({ files: [] })
    })

    it('debe responder con error 500 si el servicio retorna null', async () => {
      filesServiceMock.getFilesList.resolves(null)
      const req = {}
      const res = mockRes()
      await filesController.filesListHandler(req, res)
      expect(filesServiceMock.getFilesList.calledOnce).to.be.true
      expect(res.statusCode).to.equal(500)
      expect(res.body).to.deep.equal({ error: 'Failed to fetch files list' })
    })
  })
})
