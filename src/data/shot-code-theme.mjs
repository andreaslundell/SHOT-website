// Shiki theme built from the SHOT code tokens (tokens.json: code-*). Code panels are dark in both
// site themes, so one theme serves light and dark.
const c = {
  bg: '#1E1E22',
  fg: '#E8E5DF',
  keyword: '#FF7A6B',
  string: '#E9B872',
  fn: '#8CB4E0',
  comment: '#8A867F',
};

export default {
  name: 'shot',
  type: 'dark',
  colors: { 'editor.background': c.bg, 'editor.foreground': c.fg },
  settings: [
    { settings: { background: c.bg, foreground: c.fg } },
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: c.comment, fontStyle: 'italic' } },
    {
      scope: ['keyword', 'storage', 'storage.type', 'storage.modifier', 'keyword.control', 'keyword.operator.new', 'keyword.other', 'variable.language', 'support.type.primitive', 'constant.language'],
      settings: { foreground: c.keyword },
    },
    { scope: ['string', 'string.quoted', 'constant.character.escape', 'markup.inline.raw'], settings: { foreground: c.string } },
    { scope: ['constant.numeric'], settings: { foreground: c.string } },
    {
      scope: ['entity.name.function', 'support.function', 'meta.function-call.generic', 'entity.name.type', 'support.class', 'entity.name.class', 'entity.name.namespace'],
      settings: { foreground: c.fn },
    },
    { scope: ['variable.parameter.function.language.special', 'variable.other.option'], settings: { foreground: c.fn } },
  ],
};
