import minimist from 'minimist';

const args = minimist(process.argv.slice(2), { alias:{ 'p':'PORT' }, default:{'p':8080 } });

export default args;