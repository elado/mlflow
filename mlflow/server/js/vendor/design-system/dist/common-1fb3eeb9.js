const duBoisClassPrefix = 'du-bois-light';

/**
 * Used with the `selectEvent` utils for both Enzyme and RTL.
 */
const selectClasses = {
  clear: `${duBoisClassPrefix}-select-clear`,
  list: 'rc-virtual-list',
  open: `${duBoisClassPrefix}-select-open`,
  option: `${duBoisClassPrefix}-select-item-option-content`,
  selector: `${duBoisClassPrefix}-select-selector`
};
/**
 * @param columns List of column names
 * @param rows List of rows, where each row is a list of cell texts
 * @returns Markdown formatted string representing the data
 *
 * @example
 * // returns the string:
 * //   | Name | Fruit |
 * //   | --- | --- |
 * //   | Alice | Apple |
 * //   | Brady | Banana |
 * createMarkdownTable(['Name', 'Age'], [['Alice', 'Apple'], ['Brady', 'Banana']])
 */
function createMarkdownTable(columns, rows) {
  const headerRow = `| ${columns.join(' | ')} |`;
  const separatorRow = `| ${columns.fill('---').join(' | ')} |`;
  const dataRows = `${rows.map(row => `| ${row.join(' | ')} |`).join('\n')}`;
  const markdownTable = `${headerRow}\n${separatorRow}\n${dataRows}`;
  return markdownTable;
}

export { createMarkdownTable as c, selectClasses as s };
//# sourceMappingURL=common-1fb3eeb9.js.map
