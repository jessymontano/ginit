import inquirer from 'inquirer';
import files from './files.js';
import minimist from 'minimist';

const askGithubCredentials = () => {
    const questions = [
        {
            name: 'token',
            type: 'password',
            message: 'Introduce tu token de acceso personal o de OAuth:',
            validate: (value) => {
                if (value.length) {
                    return true;
                } else {
                    return 'Por favor introduce tu token >:C';
                }
            }
        }
    ];
    return inquirer.prompt(questions);
};

const askRepoDetails = () => {
    const argv = minimist(process.argv.slice(2));

    const questions = [
        {
            type: 'input',
            name: 'name',
            message: 'Introduce un nombre para el repositorio:',
            default: argv._[0] || files.getCurrentDirectoryBase(),
            validate: function(value){
                if (value.length) {
                    return true;
                } else {
                    return 'Por favor introduce un nombre para el repositorio >:C';
                }
            }
        },
        {
            type: 'input',
            name: 'description',
            default: argv._[1] || null,
            message: 'Opcionalmente introduce una descripcion para el repositorio:'
        },
        {
            type: 'list',
            name: 'visibility',
            message: 'Repositorio público o privado:',
            choices: ['public', 'private'],
            default: 'public'
        }
    ];
    return inquirer.prompt(questions);
};

const askCommitMessage = () => {
    const questions = [
        {
            type: 'input',
            name: 'commit',
            default: 'Initial commit',
            message: 'Elige un mensaje para el commit inicial:'
        }
    ];
    return inquirer.prompt(questions);
};

const askIgnoreFiles = (fileList) => {
    const questions = [
        {
            type: 'checkbox',
            name: 'ignore',
            message: 'Selecciona los archivos y/o folders que deseas ignorar:',
            choices: fileList,
            default: ['node_modules', 'bower_components']
        }
    ];
    return inquirer.prompt(questions);
};

export default {
    askGithubCredentials,
    askRepoDetails,
    askIgnoreFiles,
    askCommitMessage
};