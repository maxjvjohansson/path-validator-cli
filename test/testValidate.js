/*import { expect } from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import { validatePaths } from '../src/core/validatePaths.js';

describe('validatePaths Function', () => {
    let existsSyncStub;
    const projectRoot = 'test-project';

    beforeEach(() => {
        existsSyncStub = sinon.stub(fs, 'existsSync').callsFake((filePath) => {
            return !filePath.includes('missing');
        });
    });

    afterEach(() => {
        existsSyncStub.restore();
    });

    it('should correctly categorize valid and invalid paths', async () => {
        const { validPaths, invalidPaths } = await validatePaths(projectRoot);
        
        console.log('✅ Valid Paths:', validPaths);
        console.log('❌ Invalid Paths:', invalidPaths);

        expect(validPaths).to.have.lengthOf(); 
        expect(invalidPaths).to.have.lengthOf();
    });
});
*/