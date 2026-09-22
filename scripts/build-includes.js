#!/usr/bin/env node
'use strict';

// _site (빌드 산출물) 폴더의 모든 *.html 파일에서
// <!--#include header--> / <!--#include footer--> 같은 마커를
// partials/ 폴더의 실제 HTML 내용으로 치환합니다.
//
// 리포지토리에 커밋된 원본 index.html, about.html 등에는 마커만 남아있고,
// 이 스크립트는 GitHub Actions가 만든 임시 _site 사본에서만 동작하므로
// 원본 소스 파일은 절대 덮어쓰지 않습니다.
//
// 사용법: node scripts/build-includes.js [_site 경로 (기본값: _site)]

const fs = require('fs');
const path = require('path');

const SITE_DIR = process.argv[2] || '_site';
const PARTIALS_DIR = path.join(SITE_DIR, 'partials');

if (!fs.existsSync(PARTIALS_DIR)) {
  console.error(`[build-includes] partials 폴더를 찾을 수 없습니다: ${PARTIALS_DIR}`);
  process.exit(1);
}

const partials = {};
for (const file of fs.readdirSync(PARTIALS_DIR)) {
  if (!file.endsWith('.html')) continue;
  const name = path.basename(file, '.html');
  partials[name] = fs.readFileSync(path.join(PARTIALS_DIR, file), 'utf8');
}

function collectHtmlFiles(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (full === PARTIALS_DIR) continue; // partials 자체는 완성된 페이지가 아니므로 제외
      collectHtmlFiles(full, out);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

const targets = collectHtmlFiles(SITE_DIR, []);
let updatedCount = 0;

for (const filePath of targets) {
  const original = fs.readFileSync(filePath, 'utf8');
  const missing = [];

  const updated = original.replace(/<!--#include (\w+)-->/g, (match, name) => {
    if (!partials[name]) {
      missing.push(name);
      return match;
    }
    return partials[name];
  });

  if (missing.length) {
    console.warn(`[build-includes] ${filePath}: partial을 찾지 못함 - ${missing.join(', ')}`);
  }
  if (updated !== original) {
    fs.writeFileSync(filePath, updated);
    updatedCount++;
  }
}

console.log(`[build-includes] ${updatedCount}/${targets.length}개 파일에 header/footer를 삽입했습니다.`);
