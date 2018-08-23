/*
* 环境列表，第一个环境为默认环境
* envName: 指明现在使用的环境
* */

const chongqingServers = [
    {ip: '10.1.1.102', weight: 1},
    {ip: '10.1.1.103', weight: 3},
    {ip: '10.1.1.104', weight: 1}
];

const devServers = [{ip: "10.1.1.11", weight: 1}];
const testServers = [{ip: "10.1.1.12", weight: 1}];

const ENV_LIST = [
    {
        envName: 'dev',
        servers: JSON.stringify(devServers)
    },
    {
        envName: 'test',
        servers: JSON.stringify(testServers)
    },
    {
        envName: 'chongqing',
        servers: JSON.stringify(chongqingServers)
    }
]

//获取命令行参数 http://nodejs.cn/api/process.html#process_process_argv
const argv = JSON.parse(process.env.npm_config_argv).original || process.argv;
const HOST_ENV = argv[2] ? argv[2].replace(/[^a-z]+/ig,"") : '';
//没有设置环境，则默认为第一个
const HOST_CONF = HOST_ENV  ? ENV_LIST.find(item => item.envName === HOST_ENV) : ENV_LIST[0];
// 把环境常量挂载到process.env.HOST_ENV方便客户端使用
process.env.HOST_CONF = JSON.stringify(HOST_CONF);
// log选中的变量
console.log('当前环境常量=================：');
console.log(HOST_CONF);

module.exports.HOST_CONF = HOST_CONF;
module.exports.ENV_LIST = ENV_LIST;
