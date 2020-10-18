const { expect } = require('chai');
const sinon = require('sinon');
const isauth = require('../middleware/is-auth');
const authservice = require('../services/authservice');


describe('Auth Middleware', function () {
    it('should throw an error if authetification is not defined', function () {
        const req = {
            get: function (headerName) {
                return null;
            }
        }
        expect(isauth.bind(this, req, {}, () => { })).to.throw('Not authenticated.');
    });

    it('should throw an error if authentification is not well formed', function () {
        const req = {
            get: function (headerName) {
                if (headerName === 'Authorization') {
                    return 'xyz';
                } else {
                    return 'a xyz';
                }
            }
        }
        expect(isauth.bind(this, req, {}, () => { })).to.throw();
    });

    it('should call decodetoken and put userId in req', function () {
        const req = {
            get: function (headerName) {
                if (headerName === 'Authorization') {
                    return 'Bearer xyz';
                }
            }
        }
        sinon.stub(authservice, 'decodeToken');
        authservice.decodeToken.returns('abc');
        isauth(req, {}, () => { });
        expect(req).to.have.property('userId');
        expect(req).to.have.property('userId', 'abc');
        authservice.decodeToken.restore();
    });
});
