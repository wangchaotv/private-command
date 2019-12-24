const fse = require('fs-extra');
const inquirer = require('inquirer');
const open = require('open');
const chalk = require('chalk');

const path = require('path');

let docData = fse.readJSONSync(path.join(__dirname, '../config/doc.url.json'));

module.exports = program => {
  let list = program.list;
  let docNames = Object.keys(docData);
  //   展示所有的文档
  if (list === true || list === '') {
    // 选择需要的文档类型
    selectDocType(docNames);
  } else if (typeof list === 'string') {
    docNames = docNames.filter(docName =>
      docName.toLocaleLowerCase().includes(list.toLocaleLowerCase())
    );
    // 没有指定的文档类型
    if (docNames.length === 0) {
      console.log(
        chalk.blue('没有检索到') +
          chalk.red(` ${list} `) +
          chalk.blue('相关文档')
      );
    } else if (docNames.length === 1) {
      // 指定的文档类型只有一个，直接展示文档列表
      let docList = docData[docNames[0]];
      selectDoc(docList);
    } else {
      // 指定的文档类型有多个，先选择文档类型
      selectDocType(docNames);
    }
  }
};

/**
 *
 * @param {Array} docNames 文档类型名数组
 */
function selectDocType(docNames) {
  inquirer
    .prompt({
      type: 'rawlist',
      name: 'docName',
      message: '文档类型: ',
      choices: docNames
    })
    .then(answers => {
      // 继续选择文档的地址
      let docList = docData[answers.docName];
      selectDoc(docList);
    });
}

/**
 *
 * @param {Array} docList 文档列表
 */
function selectDoc(docList) {
  docList = docList.map(v => {
    return `${v.description} >>> ${v.url}`;
  });
  inquirer
    .prompt({
      type: 'rawlist',
      name: 'doc',
      message: '文档: ',
      choices: docList
    })
    .then(an => {
      let d = an.doc;
      let url = d.split('>>>')[1];
      url = url.trim();
      (async () => {
        await open(url, {
          app: ['google chrome']
        });
      })();
    });
}
