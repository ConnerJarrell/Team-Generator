  
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
//Array to store employees as they are created
const employees = [];

// INQUIRER: Hierarchical inquirer prompt functions
//Welcome message and prompt initiation
function main() {
    console.log('Welcome to your Employee Summary Generator.');
    selectEmployee();
};

//First ask the user which type of employee they will be creating
const employeePrompt = {
    type: 'rawlist',
    name: 'newEmployee',
    message: 'Which type of employee would you like to add?',
    choices: ['Manager', 'Engineer', 'Intern'],
};

//Based on the user's answer to the employeePrompt, ask the set of questions associated
//with the type of employee they will be adding
function selectEmployee() {
    inquirer.prompt(employeePrompt).then((answers) => {
        if (answers.newEmployee === 'Manager') {
            console.log('OK. You are creating a Manager.');
            newManager();
        } else if (answers.newEmployee === 'Engineer') {
            console.log('OK. You are creating an Engineer.');
            newEngineer();
        } else {
            console.log('OK. You are creating an Intern.');
            newIntern();
        }
    });
};

//Array containing questions common to all employees
const commonInputs = ([
    {
        type: 'input',
        name: 'newName',
        message: 'Please enter the name for the Employee you are adding.',
        validate: function (value) {
            let pass = value.match(
                /^[A-Za-z][A-Za-z\'\-]+([\ A-Za-z][A-Za-z\'\-]+)*/
            );
            if (pass) {
                return true;
            }
            return 'Please enter a valid name. (You may not use numbers or any special characters besides . ,  \' , or - .'
        },
    },
    {
        type: 'input',
        name: 'newID',
        message: 'Please enter the ID for the Employee you are adding.',
        validate: function (value) {
            var valid = !isNaN(parseFloat(value));
            return valid || 'Please enter a number';
        },
    },
    {
        type: 'input',
        name: 'newEmail',
        message: 'Please enter the email for the Employee you are adding.',
        validate: function (value) {
            let pass = value.match(
                /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
            );
            if (pass) {
                return true;
            }
            return 'Please enter a valid email address.'
        },
    }
]);

//When Manager is selected from the employeePrompt, the user is presented with these questions.
const managerQuestions = () => {
    const managerSpecificPrompt = {
        type: 'input',
        name: 'newManagerOfficeNumber',
        message: 'Please enter the office number for the Manager you are adding.',
    };
    const managerPrompts = commonInputs.concat(managerSpecificPrompt);
    return managerPrompts;
};
//Generate a new Manager instance based on user input and push to employee array
function newManager() {
    inquirer.prompt(managerQuestions()).then((answers) => {
        const newManager = new Manager(answers.newName, answers.newID, answers.newEmail, answers.newManagerOfficeNumber);
        employees.push(newManager);
        return newManager;
    }).then(addMorePrompt);//ask user if they would like to add another employee
};

//When Engineer is selected from the employeePrompt, the user is presented with these questions.
const engineerQuestions = () => {
    const engineerSpecificPrompt = {
        type: 'input',
        name: 'newEngineerGitHub',
        message: 'Please enter the GitHub username for the Engineer you are adding.',
    };
    const engineerPrompts = commonInputs.concat(engineerSpecificPrompt);
    return engineerPrompts;
};
//Generate a new Engineer instance based on user input and push to employee array
function newEngineer() {
    inquirer.prompt(engineerQuestions()).then((answers) => {
        const newEngineer = new Engineer(answers.newName, answers.newID, answers.newEmail, answers.newEngineerGitHub);
        employees.push(newEngineer);
        //return newEngineer;
    }).then(addMorePrompt); //ask user if they would like to add another employee
};

//When Intern is selected from the employeePrompt, the user is presented with these questions.
const internQuestions = () => {
    const internSpecificPrompt = {
        type: 'input',
        name: 'newInternSchool',
        message: 'Please enter the school name for the Intern you are adding.',
    };
    const internPrompts = commonInputs.concat(internSpecificPrompt);
    return internPrompts;
};
//Generate a new Intern instance based on user input and push to employee array
function newIntern() {
    inquirer.prompt(internQuestions()).then((answers) => {
        const newIntern = new Intern(answers.newName, answers.newID, answers.newEmail, answers.newInternSchool);
        employees.push(newIntern);
        //return newIntern;
    }).then(addMorePrompt); //ask user if they would like to add another employee
};

//Asks the user if they want to add another employee after each entry
function addMorePrompt() {
    inquirer.prompt({
        type: 'confirm',
        name: 'addAnotherEmployee',
        message: 'Would you like to add another employee?'
    }).then(answers => {
        if (answers.addAnotherEmployee) {
            selectEmployee();
        } else {
            console.log('Success');
            //When the user has finished entering all team members, call a function to render
            //the HTML and generate the team page
            outputTeamHTML(employees);

        };
    });
};
//end inquirer prompt functions

// Generate and write the rendered HTML to a file named `team.html` in the `output` folder.
const outputTeamHTML = async (employees) => {
    try {
        const employeeHTML = await render(employees);
        fs.writeFile(outputPath, employeeHTML, (err) => {
            if (err) {
                throw err;
            } else {
                console.log('Success! Your team page has been generated.');
            }
        }
        )
    } catch (error) {
        throw error;
    };
};

main();


