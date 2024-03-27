#!/usr/bin/env node
import chalk from 'chalk';
import clear from 'clear';
import github from './lib/github.js';
import repo from './lib/repo.js';
import files from './lib/files.js';

clear();

if (files.directoryExists('.git')){
    console.log(chalk.red('El directorio ya es un repositorio de git >:C'));
    process.exit();
}

const getGithubToken = async () => {
    let token = await github.getStoredGithubToken();
    if (token) {
        console.log(chalk.green("Sesion iniciada correctamente! :)"));
        return token;
    }
    console.log(chalk.yellow('Token no encontrado'));

    token = await github.getPersonalAccessToken();

    return token;
};

const run = async () => {
    try {
        const token = await getGithubToken();
        github.githubAuth(token);
        const url = await repo.createRemoteRepo();
        await repo.createGitignore();
        await repo.setupRepo(url);

        console.log(chalk.green('Todo listo uwu'));
    } catch(err) {
        if (err) {
            switch (err.status) {
                case 401:
                    console.log(chalk.red('No se pudo iniciar sesión. Por favor introduce un token correcto >:C'));
                    break;
                case 422:
                    console.log(chalk.red('Ya hay un repositorio remoto con el mismo nombre :C'));
                    break;
                default:
                    console.log(chalk.red(err));
            }
        }
    }
};

run();
