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
// partials/header.html, partials/footer.html은 사이트 최상위 기준
// 상대 경로("./index.html" 등)로 작성되어 있습니다. tools/*.html처럼
// 하위 폴더에 있는 페이지에 삽입할 때는 그만큼 "../"를 덧붙여야
// 링크와 로고 이미지 경로가 깨지지 않습니다.
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

  // SITE_DIR 바로 아래(깊이 0)면 "./"를 그대로 두고,
  // tools/ac.html처럼 한 단계 아래(깊이 1)면 "../"를 붙이는 식으로
  // 페이지 위치에 맞춰 partial 안의 루트 상대 경로를 보정합니다.
  const depth = path.relative(SITE_DIR, filePath).split(path.sep).length - 1;
  const prefix = '../'.repeat(depth);

  const included = original.replace(/<!--#include (\w+)-->/g, (match, name) => {
    if (!partials[name]) {
      missing.push(name);
      return match;
    }
    return depth > 0
      ? partials[name].replace(/(href|src)="\.\//g, `$1="${prefix}`)
      : partials[name];
  });

  // 모든 배포 페이지에서 공통 파비콘을 사용합니다. 이미 같은 경로의
  // 파비콘 선언이 있는 원본 페이지에는 중복해서 추가하지 않습니다.
  const faviconPath = `${depth > 0 ? prefix : './'}assets/logo.png`;
  const faviconTag = `<link rel="icon" type="image/png" href="${faviconPath}">`;
  const hasFavicon = /<link\b[^>]*\brel=["'][^"']*\bicon\b[^"']*["'][^>]*>/i.test(included);
  const updated = hasFavicon
    ? included
    : included.replace(/<\/head\s*>/i, `${faviconTag}\n</head>`);

  if (missing.length) {
    console.warn(`[build-includes] ${filePath}: partial을 찾지 못함 - ${missing.join(', ')}`);
  }
  if (updated !== original) {
    fs.writeFileSync(filePath, updated);
    updatedCount++;
  }
}

console.log(`[build-includes] ${updatedCount}/${targets.length}개 파일에 header/footer를 삽입했습니다.`);
