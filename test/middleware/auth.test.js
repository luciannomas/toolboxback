const { expect } = require('chai')
const sinon = require('sinon')
const apiKeyMiddleware = require('../../middleware/auth')

describe('apiKeyMiddleware', () => {
  let req, res, next

  beforeEach(() => {
    req = { headers: {} }
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    }
    next = sinon.stub()
  })

  it('permite el acceso si la API Key es correcta', () => {
    req.headers['authorization'] = 'Bearer aSuperSecretKey'
    apiKeyMiddleware(req, res, next)
    expect(next.calledOnce).to.be.true
    expect(res.status.called).to.be.false
    expect(res.json.called).to.be.false
  })

  it('rechaza el acceso si la API Key es incorrecta', () => {
    req.headers['authorization'] = 'Bearer wrongKey'
    apiKeyMiddleware(req, res, next)
    expect(next.called).to.be.false
    expect(res.status.calledOnceWith(401)).to.be.true
    expect(res.json.calledOnceWith({ error: 'Unauthorized' })).to.be.true
  })

  it('rechaza el acceso si no hay header de autorización', () => {
    apiKeyMiddleware(req, res, next)
    expect(next.called).to.be.false
    expect(res.status.calledOnceWith(401)).to.be.true
    expect(res.json.calledOnceWith({ error: 'Unauthorized' })).to.be.true
  })
}) 