import minimist from 'minimist';

const args = minimist(process.argv.slice(2), { alias:{ p:'PORT',m:'MODE' }, default:{p:8080,m:'cluster' } });

export default args;