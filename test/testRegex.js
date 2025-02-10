import { expect } from 'chai';
import { cssRegex } from '../src/utils/regex.js';

describe('CSS Regex Tests', function() {
  it('should match url in background-image', function() {
    const css = 'background-image: url("image.jpg");';
    const result = css.match(cssRegex.url);
    expect(result).to.not.be.null;
    expect(result[0]).to.include('image.jpg');
  });

  it('should match url in @import', function() {
    const css = '@import url("styles.css");';
    const result = css.match(cssRegex.url);
    expect(result).to.not.be.null;
    expect(result[0]).to.include('styles.css');
  });

  it('should match url in cursor', function() {
    const css = 'cursor: url("cursor.png"), auto;';
    const result = css.match(cssRegex.url);
    expect(result).to.not.be.null;
    expect(result[0]).to.include('cursor.png');
  });

  it('should match url in content', function() {
    const css = 'content: url("icon.png");';
    const result = css.match(cssRegex.url);
    expect(result).to.not.be.null;
    expect(result[0]).to.include('icon.png');
  });
});
