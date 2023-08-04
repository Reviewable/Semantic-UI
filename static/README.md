---
layout: layouts/base.njk
css : 'index'
title : 'README'
type : 'Semantic'
---

<div class="ui segment">

# SemanticUI Pre-1.0 adapted for use in Reviewable.

This version of Semantic has been retrofitted to use CSS custom properties (variables) for theming. Color variables take the form `--sui-color-number`. There are many colors in the original component design and many are very similar. Instead of requiring each and every color to be set when building a theme, we introduce a 'lofi' version that maps a handful (31) of colors to the many (118) original color definitions.

## Development

`yarn` to pull down deps.

`grunt` will run the dev server. It will open the docs sample in your browser at port `9000` by default. When you make changes to any of the Semantic source files or the docs source (which is in `static`), Semantic and the docs will be rebuilt. You probably don't need to make any changes to the docs though unless you are adding new components and want samples and variations of them to use in development. You can view the various versions of the color palettes at `http://localhost:9000/views/colors/`.

### Adding colors.

1. All color shades exist in `theme.json`. They are unsorted so just stick them under any heading that makes sense.
2. Use the sort script in `scripts/color-sort.mjs`. This will output a file, `sorted.less` in the root of the project with all colors sorted by lightness (as in the L in HSL). 
   a. This is NOT incorporated into the build, but helps you identify where colors should be placed in the list of variables. 
   b. This script also updates the data files in the docs which displays colors in the variable set at `http://localhost:9000/views/colors/`.
   c. The script blends any `rgba` colors with white so feel free to paste those into the list as is. The assumption here though is that the alpha channel was being used to control lightness of the color and actual transparency is unimportant.
3. Add the new colors as a variable in the list of variables in `src/theme.less` in the correct order as identified by the `sorted.less` file. Make sure to add/update `lofi.theme.less` as necessary with the new color.
4. Run `colorguard` to make sure you aren't using a color that is imperceptibly different than the existing shades when updating `lofi`. `Colorguard` is built into the `color-sort` script by passing `true` as an argument when running the script. This is the only option the script will accept. This eliminates the colors from the sorted output that are too similar. If your color isn't showing up in the `sorted.less` file, ask yourself if you actually need to introduce it - it's probably similar to an existing color. If you *really* need that extra shade, you can adjust the colorguard `threshold` in `scripts/color-sort.mjs` from 8 to a lower value, which will eventually let your color through. Read more about colorguard in their [docs](https://github.com/SlexAxton/css-colorguard).

In `theme.less` the comment on the rhs of each variable refers to the frequency of usage of a color in the original Semantic styles. Where possible we ensure that at least the highest, or 2 of the highest frequency shades of each color is used in the lofi palette.

The `docs` sample site uses sessions storage and stylesheet toggles to support a side by side workflow where each browser/tab can be set to display a particular stylesheet. This lets you make changes (e.g. to the lofi styles) while ensuring minimal visual regressions take place.

## Consumption in Reviewable

Currently, we don't pull from NPM or anything, just pull in the files from Github at `build/packaged/*`. In the very near future all javascript that was originally a part of SemanticUI will be stripped out of Reviewable, and at that point, out of this repo as well. As such, no javascript is demonstrated in the sample docs and those should be used for developing the CSS only. Note that the CSS is left in place for the original javascript components (modules), in case we want to build Reviewable specific widgets at any point.

</div>
