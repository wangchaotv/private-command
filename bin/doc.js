#!/usr/bin/env node

const commander = require('commander');
const program = new commander.Command();

const doc = require('../package/commander/doc');

program.version('0.0.1');

program.option('-l --list [docName]', '控制台打印所有的可选文档');

program.parse(process.argv);

doc(program);
