import inquirer from "inquirer";

export async function askForAutoCorrect() {
    const answer = await inquirer.prompt([
        {
            type: "confirm",
            name: "autoCorrect",
            message: "Would you like to autocorrect all invalid paths?",
            default: false
        }
    ]);

    return answer.autoCorrect;
}
