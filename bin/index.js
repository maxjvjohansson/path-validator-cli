#!/usr/bin/env node

import { Command } from 'commander';
import ora from 'ora';
import { validatePaths } from '../src/core/validatePaths.js';
import { fixPaths } from '../src/core/fixPaths.js';
import { askForAutoCorrect } from '../src/cli/prompts.js';
import { showResults, showErrorMessage, showSearchingMessage, showFixingMessage, showAllFixedMessage, showNoChangesMessage } from '../src/cli/output.js';

const projectRoot = process.cwd();
const program = new Command();

program
    .name("path-validator")
    .version("1.0.0")
    .description("Validate and fix broken file paths in your project")
    .option("--check-only", "Only validate paths without fixing them")
    .action(async (options) => {
        showSearchingMessage();

        const spinner = ora("Scanning project for paths...").start();

        try {
            const { validPaths, invalidPaths } = await validatePaths(projectRoot);

            spinner.stop();
            showResults(invalidPaths);

            if (options.checkOnly) return;

            if (invalidPaths.length > 0) {
                const shouldFix = await askForAutoCorrect();
                if (shouldFix) {
                    showFixingMessage();
                    await fixPaths(projectRoot);
                    showAllFixedMessage();
                } else {
                    showNoChangesMessage();
                }
            }
        } catch (error) {
            spinner.stop();
            showErrorMessage(error);
        }
    });

program.parse(process.argv);



