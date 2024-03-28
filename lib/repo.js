import CLI from 'clui';
import fs from 'fs';
import {simpleGit} from 'simple-git';
const Spinner = CLI.Spinner;
const git = simpleGit();
import touch from 'touch';
import _ from 'lodash';

import inquirer from './inquirer.js';
import gh from './github.js';

const createRemoteRepo = async () => {
    const github = gh.getInstance();
    const answers = await inquirer.askRepoDetails();

    const data = {
        name: answers.name,
        description: answers.description,
        private: (answers.visibility === 'private')
    };

    const status = new Spinner("Creando un repositorio remoto...");
    status.start();

    try {
        const response = await github.repos.createForAuthenticatedUser(data);
        return response.data.html_url;
    } finally {
        status.stop();
    }
};

const createGitignore = async () => {
    const filelist = _.without(fs.readdirSync('.'), '.git', '.gitignore');

    if (filelist.length) {
        const answers = await inquirer.askIgnoreFiles(filelist);

        if(answers.ignore.length) {
            fs.writeFileSync('.gitignore', answers.ignore.join('\n'));
        } else {
            touch('.gitignore');
        }
    } else {
        touch('.gitignore');
    }
};

const setupRepo = async (url) => {
    const commitMessage = await inquirer.askCommitMessage();
    const status = new Spinner("Inicializando repositorio local y subiendo al remoto...");
    status.start();
    try {
        await git.init()
        .add('.gitignore')
        .add('./*')
        .commit(commitMessage.commit)
        .addRemote('origin', url)
        .push('origin', 'master',{ '--set-upstream': null });
    } finally {
        status.stop();
    }
}

export default {
    createRemoteRepo,
    createGitignore,
    setupRepo
};
