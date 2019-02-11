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
    this.dispatchEvent(new CustomEvent('complete', {
      detail: this.singleTodo.Id
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