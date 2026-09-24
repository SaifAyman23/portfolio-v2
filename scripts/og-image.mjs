#!/usr/bin/env node
import process from 'node:process'
import sharp from 'sharp'

const WIDTH = 1200
const HEIGHT = 630

const svg =
  `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">` +
  `<rect width="${WIDTH}" height="${HEIGHT}" fill="#0b0b0c"/>` +
  `<rect x="0" y="0" width="${WIDTH}" height="10" fill="#b50000"/>` +
  `<rect x="90" y="470" width="140" height="8" fill="#b50000"/>` +
  `<text x="90" y="330" font-family="Arial, Helvetica, sans-serif" font-size="110" font-weight="bold" fill="#ffffff" letter-spacing="2">SAIF ELDIN AYMAN</text>` +
  `<text x="92" y="410" font-family="Arial, Helvetica, sans-serif" font-size="42" fill="#9a9aa0" letter-spacing="12">FULL-STACK ENGINEER</text>` +
  `</svg>`

const info = await sharp(Buffer.from(svg)).webp({ quality: 82 }).toFile('public/og.webp')
console.log(`public/og.webp ${info.width}x${info.height} ${Math.round(info.size / 1024)} KB`)
process.exitCode = 0
