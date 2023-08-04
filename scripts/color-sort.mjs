import tinycolor from "tinycolor2";
import colors from "../theme.json" assert {type: "json"};
import colorguard from 'colorguard'
import fs from 'fs';

const guarded = process.argv[2]

const blendRgbaWithWhite = (rgba) => {
  const color = tinycolor(rgba);
  const a = color.toRgb().a;
  const r = Math.floor(color.toRgb().r * a + 0xff * (1 - a));
  const g = Math.floor(color.toRgb().g * a + 0xff * (1 - a));
  const b = Math.floor(color.toRgb().b * a + 0xff * (1 - a));
  return '#' + ((r << 16) | (g << 8) | b).toString(16);
}

const buildStyles = (colors) => {
  let stylesheet = ':root {\n';
  colors.forEach(color => {
    color.shades.forEach(shade => {
      stylesheet += `${shade};\n`;
    })
  })
  stylesheet += `\n}`;
  return stylesheet;
}

const recordedShades = new Set()

const colorDecks = Object
  .entries(colors)
  .map(([name, shades]) => {
    let adjustor = 0;
    return {
      name,
      shades: shades
        .map(shade => {
          if (shade.includes('rgba') || shade.includes('hsla')) {
            return tinycolor(blendRgbaWithWhite(shade));
          } else {
            return tinycolor(shade);
          }
        })
        .sort((colorA, colorB) => colorA.toHsl().l - colorB.toHsl().l)
        .map((shade, i) => {
          const original = shade.getOriginalInput();
          if (recordedShades.has(original)) {
            adjustor--;
            return
          }
          recordedShades.add(original);
          return `--sui-${name}-${i + adjustor + 1}: ${original}`;
        })
        .filter(Boolean)
    }
  })

const css = buildStyles(colorDecks);

if (guarded) {
  colorguard.process(css, { threshold: 8 }).then(result => {
    result = result.messages.map(res => ({ first: res.firstColor, second: res.secondColor }))
    const checks = new Map();
    result.forEach(res => {
      if (checks.has(res.second)) return;
      const regex = new RegExp(`--sui-(?:red|green|blue|teal|orange|purple|yellow|grey|white|black)-\\d*:(\\s${res.second})`);
      checks.set(res.second, regex);
    })
    let updatedCss = '';
    const lines = css.split('\n');
    addLines: for (const line of lines) {
      for (const [check, regex] of checks) {
        if (regex.test(line)) continue addLines;
      }
      updatedCss += line + '\n';
    }
    fs.writeFileSync('./sorted.less', updatedCss);
  })
} else {
  fs.writeFileSync('./sorted.less', css);
  fs.writeFileSync('./static/_data/colors.json', JSON.stringify(colorDecks));
}

