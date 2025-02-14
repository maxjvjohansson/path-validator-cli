#!/usr/bin/env node

import { Command } from 'commander';
import { validatePaths } from '../src/core/validatePaths.js';
import { fixPaths } from '../src/core/fixPaths.js';
import { promptFixPaths } from '../src/cli/prompts.js';
import { showResults, showSummary } from '../src/cli/output.js';

// Get projectroot
const projectRoot = process.cwd();

// Create commander CLI
const program = new Command();

program
    .name('path-validator')
    .version('1.0.0')
    .description('Validate and fix broken file paths in your project');

program
    .option('--check-only', 'Only validate paths without fixing them')
    .action(async (options) => {
        const { validPaths, invalidPaths } = await validatePaths(projectRoot);

        showResults(validPaths, invalidPaths);

        if (options.checkOnly) {
            showSummary(invalidPaths.length, false);
            return;
        }

        if (invalidPaths.length > 0) {
            const shouldFix = await promptFixPaths();
            if (shouldFix) {
                await fixPaths(projectRoot);
            } else {
                showSummary(invalidPaths.length, false);
            }
        } else {
            showSummary(0, true);
        }
    });

program.parse(process.argv);

