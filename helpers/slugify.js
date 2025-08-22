const slugify = require("slugify"); // Slugify modülünü içe aktar

const options = {
  lower: true,
  strict: true,
  locale: "tr",
  trim: true,
  remove: undefined,
  replacement: "-"
};

module.exports = function slugifyText(text) {
  return slugify(text, options);
}; 
