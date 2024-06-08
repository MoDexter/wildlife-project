const APP_ID = 'wildlife-mbkzpsn';
const ATLAS_SERVICE = 'mongodb-atlas';
const app = new Realm.App({id: APP_ID});

let user_id = null;
let mongodb = null;
let coll = null;

// Function executed by the LOGIN button.
function getUser() {
    return document.getElementById("username").value; 
}

function getPass() {
    return document.getElementById("password").value;
}



const login = async () => {
    const credentials = Realm.Credentials.emailPassword(getUser(), getPass());
    console.log(credentials);
    try {
        const user = await app.logIn(credentials);
        $('#userid').empty().append(user.id); // update the user div with the user ID
        user_id = user.id;
        mongodb = app.currentUser.mongoClient(ATLAS_SERVICE);
        coll = mongodb.db("wildlife").collection("animals");
        $('#login-page').hide(); // Hide the login button after successful login

    } catch (err) {
        console.error("Failed to log in", err);
    }
};



const insert_todo = async () => {
    console.log("INSERT");
    const task = $('#taskInput').val();
    await coll.insertOne({task, status: false, owner_id: user_id});

    // Clear the input field after inserting
    $('#taskInput').val('');

    // Append a new input element to the page
    const newInput = $('<input>').attr({
        type: 'text',
        value: task
    });
    $('body').append(newInput);
};

const delete_todo = async () => {
    console.log("DELETE");
    const task = $('#taskInput').val();
    await coll.deleteOne({task, owner_id: user_id});
    find_animals();
}

// Function executed by the "FIND" button.
const find_animals = async () => {
    if (mongodb == null || coll == null) {
        $("#userid").empty().append("Need to login first.");
        console.error("Need to log in first", err);
        return;
    }

    // Retrieve todos
    const todos = await coll.find({}, {
        "projection": {
            "_id": 0,
            "animal_species": 1,
            "animal_biome": 1
        }
    });

    console.log(todos);

    // Access the todos div and clear it.
    let todos_div = $("#animals");
    todos_div.empty();

    // Loop through the todos and display them in the todos div.
    for (const todo of todos) {
        let p = document.createElement("p");
        p.append(todo.animal_species);
        p.append(": ");
   
        p.append(todo.animal_biome);
        todos_div.append(p);
    }
};