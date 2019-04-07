import { Observable } from "tns-core-modules/data/observable";

import * as firebase from "nativescript-plugin-firebase";
import * as dialogs from "tns-core-modules/ui/dialogs";

import { clipToBoundsProperty } from "tns-core-modules/ui/layouts/layout-base";

export class HelloWorldModel extends Observable {

    private _todos: string[];

    constructor() {
        super();

        // Initialize default values.
        this._todos = [];

        // listen to changes in the /todos path
        firebase.addValueEventListener((result) => {
            console.log("this: " + this);
            console.log("Event type: " + result.type);
            console.log("Key: " + result.key);
            console.log("Value: " + JSON.stringify(result.value));

            let todos = [];
            for (const key in result.value) {
                if (result.value.hasOwnProperty(key)) {
                    const todo = result.value[key];
                    todos.push({
                        title: todo.title,
                        onTap: () => {
                            console.log("onTap'ed for id = " + key);
                            firebase.remove("/todos/" + key);
                        }
                    });
                }
            }
            console.log("Todos: " + JSON.stringify(todos));

            todos.sort((a, b) => a.title < b.title ? -1 : 1);

            this._todos = todos;
            this.notifyPropertyChange("todos", todos);

        }, "/todos");
    }

    get todos(): string[] {
        return this._todos;
    }

    onAdd() {
        dialogs.prompt({
            title: "Add something",
            okButtonText: "OK",
            cancelButtonText: "Cancel",
        }).then(function (r) {
            if (r.result) {
                firebase.push("/todos", {
                    title: r.text
                });
            }
        });
    }
}
