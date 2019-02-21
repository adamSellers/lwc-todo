import {
  LightningElement,
  api
} from 'lwc';

export default class SingleTodo extends LightningElement {
  // define a public property to handle the single todo being passed in. 
  @api singleTodo;
  newTodoValue;

  changeTodoValue(evt) {
    if (this.newTodoValue !== evt.target.value) {
      this.newTodoValue = evt.target.value;
    }
  }

  // define hanlders for the different event types
  completedHandler() {
    let detailObject = {};
    // check to see if it is being completed or incompleted
    console.log('the single todo on the completed click was: ' + JSON.stringify(this.singleTodo));
    if (this.singleTodo.Completed__c) {
      detailObject = {
        context: 'incomplete',
        todoId: this.singleTodo.Id
      };
    } else {
      detailObject = {
        context: 'complete',
        todoId: this.singleTodo.Id
      };
    }
    this.dispatchEvent(new CustomEvent('complete', {
      detail: detailObject
    }));
  }

  deletedHandler() {
    this.dispatchEvent(new CustomEvent('delete', {
      detail: this.singleTodo.Id
    }));
  }

  saveHandler() {
    // send the ID and the new value to the containing component
    // upon record change, after first checking to see if 
    // there's been a change. 
    if (this.newTodoValue !== this.singleTodo.Todo__c && this.newTodoValue) {
      const detailObject = {
        todoId: this.singleTodo.Id,
        todo: this.newTodoValue
      }
      this.dispatchEvent(new CustomEvent('save', {
        detail: detailObject
      }));
    }
  }
}