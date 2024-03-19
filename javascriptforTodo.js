if (localStorage.getItem("toDoList") === null) {
    var names = [];
    localStorage.setItem("toDoList", JSON.stringify(names));
}
// Initialize the array to store indices of done items
var doneItems = JSON.parse(localStorage.getItem("doneItems")) || [];
var doneCounter = localStorage.getItem("doneCounter") ? parseInt(localStorage.getItem("doneCounter")) : 0; // Initialize the counter from local storage or default to 0 if not present

function validateForm() {
    var input = document.getElementById("todoItem").value;
    if (input == null || input.length < 3) {
        document.getElementById("todoItem").style.borderColor = "red";
        document.getElementById("todoFeedback").innerHTML = "You have to write a todo more than three letters long";
        return false;
    } else {
        document.getElementById("todoFeedback").style.borderColor = ""; // Reset border color
        return true;
    }
}

function saveAndshowData() {
    var names = JSON.parse(localStorage.getItem("toDoList"));
    var todoItem = document.getElementById("todoItem").value;

    // Create a new object with the todo and a done-button
    var toDoObject = {
        todoItem: todoItem,
    };

    // Push the new object to the array
    names.push(toDoObject);

    // Save updated list to local storage
    localStorage.setItem("toDoList", JSON.stringify(names));

    // Call showData function if it's defined
    if (typeof showData === "function") {
        showData();
    }
}

function showData() {
    var allItems = localStorage.getItem("toDoList");
    var jsonItems = JSON.parse(allItems);

    var table = "<table border='1'><tr><th>Nro</th><th>To Do</th><th>Done?</th></tr>";    
    var indicesToMarkAsDone = []; // Array to store indices of items marked as done TRIED TO FIGURE OUT ONLOAD ISSUE
    for (var i = 0; i < jsonItems.length; i++) {
        var isDone = doneItems[i] === true; // Check if the item is marked as done

        table += "<tr id='todoItem_" + i + "'><td>" + (i + 1) + "</td><td>" + jsonItems[i].todoItem +
            "</td><td>";

        if (isDone) {
            table += "Yes";
            var todoItemElement = document.getElementById("todoItem_" + i);            
                todoItemElement.style.color = "gray";
                todoItemElement.style.textDecoration = "line-through";
                indicesToMarkAsDone.push(i); // Store index to mark as done later                                
            
        } else {
            table += "<button id='button_" + i +"' class='button' onclick='itemToDone(" + i + ")'>Done</button>";
        }

        table += "</td></tr>";
    }
    table += "</table>";

    var place = document.getElementById("storage_place");
    place.innerHTML = table;

    var counter = document.getElementById("rowCounter");
    counter.innerHTML = "<p>Total: " + jsonItems.length +"</p>";

    var doneCounterElement = document.getElementById("doneCounter");
    if (doneCounterElement) {
        doneCounterElement.innerHTML = "<p>Done tasks: " + doneCounter + "</p>";
    }
     // Mark items as done using the indicesToMarkAsDone array
     itemToDone(indicesToMarkAsDone);
    
}

function deleteData() {
    var delNum = parseInt(document.getElementById("delNumber").value) - 1; // Parse input value and adjust index

    var myList = localStorage.getItem("toDoList");
    var jsonList = JSON.parse(myList);

    if (delNum >= 0 && delNum < jsonList.length) { // Check if index is valid
        jsonList.splice(delNum, 1); // Remove one item at delNum index

        // Remove the index from the doneItems array if it exists
        if (doneItems.includes(delNum)) {
            doneItems.splice(doneItems.indexOf(delNum), 1);
            doneCounter--;
        }

        // Update the doneCounter element
        var doneCounterElement = document.getElementById("doneCounter");
        if (doneCounterElement) {
            doneCounterElement.textContent = "Done tasks: " + doneCounter;

            // Save the updated counter in local storage
            localStorage.setItem("doneCounter", doneCounter.toString());

            // Save the updated doneItems array in local storage
            localStorage.setItem("doneItems", JSON.stringify(doneItems));
        }

        localStorage.setItem("toDoList", JSON.stringify(jsonList));
        showData();
    } else {
        alert("Invalid row number."); // Notify the user if the row number is invalid
    }
}

function itemToDone(index) {
    var allItems = JSON.parse(localStorage.getItem("toDoList"));
    var todoItem = allItems[index].todoItem;

    // Find the todo item element by its index and the button element with the same index
    var todoItemElement = document.getElementById("todoItem_" + index);    

    if (todoItemElement) {
        // Mark the item as done visually
        todoItemElement.style.color = "gray";
        todoItemElement.style.textDecoration = "line-through";

        // Add the index to the doneItems array
        doneItems.push(index);

        // Update the todo list in localStorage
        localStorage.setItem("toDoList", JSON.stringify(allItems));

        // Update the doneCounter element
        var doneCounterElement = document.getElementById("doneCounter");
        if (doneCounterElement) {
            doneCounterElement.innerHTML = "<p>Done tasks: " + ++doneCounter +"</p>";
        // hide button
        var ButtonElement = document.getElementById("button_"+index)
        if(ButtonElement){
            ButtonElement.style.display="none";
            console.log("this is button with index: " + index);
        }            

         // Save the updated counter in local storage
         localStorage.setItem("doneCounter", doneCounter.toString());

         // Save the updated doneItems array in local storage
         localStorage.setItem("doneItems", JSON.stringify(doneItems));
        }
    } else {
        console.log("Todo item element not found for index " + index);
    }
}

function clearDoneTasks() {
    // Retrieve the current to-do list from local storage
    var toDoList = JSON.parse(localStorage.getItem("toDoList"));

    // Filter out the items that are not marked as done
    var remainingTasks = toDoList.filter((item, index) => !doneItems.includes(index));

    // Save the remaining tasks back to local storage
    localStorage.setItem("toDoList", JSON.stringify(remainingTasks));

    // Clear the doneItems array
    doneItems = [];

    // Reset the doneCounter to zero
    doneCounter = 0;

    // Update the doneCounter element in the UI
    var doneCounterElement = document.getElementById("doneCounter");
    if (doneCounterElement) {
        doneCounterElement.textContent = "Done tasks: " + doneCounter;
    }

    // Clear the localStorage entries for done items and the done counter
    localStorage.removeItem("doneItems");
    localStorage.removeItem("doneCounter");

    // Update the display to reflect the changes
    showData();
}

