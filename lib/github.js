import CLI from 'clui';
import Configstore from 'configstore';
import {Octokit} from '@octokit/rest';
const Spinner = CLI.Spinner;
import { createTokenAuth } from '@octokit/auth-token';
import inquirer from './inquirer.js';

const conf = new Configstore("ginit");

let octokit;

const getInstance = () => {
    return octokit;
};

const getStoredGithubToken = () => {
    return conf.get('github.token');
};

const getPersonalAccessToken = async () => {
    console.log("Genera un token de acceso con scopes de user y repo: https://github.com/settings/tokens");
    const credential = await inquirer.askGithubCredentials();
    const status = new Spinner('Autenticando, por favor espera...');

    status.start();

    const auth = createTokenAuth(credential.token);

    try {
        const res = await auth();

        if (res.token) {
            conf.set('github.token', res.token);
            console.log("Sesion iniciada correctamente!");
            return res.token;
        } else {
            throw new Error("El token de GitHub no fue encontrado en la respuesta");
        }
    } finally {
        status.stop();
    }
};

const githubAuth = (token) => {
    octokit = new Octokit({
        auth: token
    });
};

export default {
    getInstance,
    getStoredGithubToken,
    getPersonalAccessToken,
    githubAuth
};