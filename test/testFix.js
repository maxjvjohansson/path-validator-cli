import { expect } from 'chai';
import * as fix from '../src/core/fix.js';

describe('Fix Paths', function () {
    it('should convert absolute paths to relative', function () {
        const projectRoot = '/Users/Web/project/';
        
        const result = fix.correctPath('/Users/Web/project/scripts/app.js', projectRoot);
        expect(result).to.equal('scripts/app.js');
    });

    it('should not modify already relative paths', function () {
        const projectRoot = '/Users/Web/project/';
        
        const result = fix.correctPath('scripts/app.js', projectRoot);
        expect(result).to.equal('scripts/app.js');
    });

    it('should return the original path if it is outside the project root', function () {
        const projectRoot = '/Users/Web/project/';
        
        const result = fix.correctPath('/Users/Other/path.js', projectRoot);
        expect(result).to.equal('/Users/Other/path.js');
    });
});