const fs = require('fs');

function validate(siteInfo) {
  const errors = [];

  if (!siteInfo || typeof siteInfo !== 'object') {
    errors.push('siteinfo is not an object');
    throw new Error(errors.join('; '));
  }

  // slug field is no longer required after URL structure simplification

  if (!siteInfo.hero || typeof siteInfo.hero !== 'object') {
    errors.push('hero object is required');
  } else {
    if (!siteInfo.hero.title || typeof siteInfo.hero.title !== 'string') errors.push('hero.title (string) is required');
    if (!siteInfo.hero.description || typeof siteInfo.hero.description !== 'string') errors.push('hero.description (string) is required');
    if (!siteInfo.hero.coverImage || typeof siteInfo.hero.coverImage !== 'string') errors.push('hero.coverImage (string) is required');
  }

  if (!siteInfo.chapterList || typeof siteInfo.chapterList !== 'object') {
    errors.push('chapterList object is required');
  } else {
    if (!siteInfo.chapterList.title || typeof siteInfo.chapterList.title !== 'string') errors.push('chapterList.title (string) is required');
    if (!siteInfo.chapterList.subtitleTemplate || typeof siteInfo.chapterList.subtitleTemplate !== 'string') errors.push('chapterList.subtitleTemplate (string) is required');
    if (!siteInfo.chapterList.cta || typeof siteInfo.chapterList.cta !== 'object') errors.push('chapterList.cta object is required');
    else {
      if (!siteInfo.chapterList.cta.readNowPathTemplate || typeof siteInfo.chapterList.cta.readNowPathTemplate !== 'string') errors.push('chapterList.cta.readNowPathTemplate (string) is required');
    }
  }

  if (errors.length > 0) {
    throw new Error('siteinfo validation failed: ' + errors.join('; '));
  }

  return true;
}

module.exports = validate;
