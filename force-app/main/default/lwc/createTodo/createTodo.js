import {
  LightningElement,
  track
} from 'lwc';
import {
  createRecord
} from 'lightning/uiRecordApi';
import {
  ShowToastEvent
} from 'lightning/platformShowToastEvent';
import TODO_OBJECT from '@salesforce/schema/Todo__c';
import TODO_FIELD from '@salesforce/schema/Todo__c.Todo__c';
import COMPLETED_FIELD from '@salesforce/schema/Todo__c.Completed__c';

export default class CreateTodo extends LightningElement {
  @track newTodo = 'Please enter a todo';
  completedFlag = false;

  handleFocus() {
    if (this.newTodo === 'Please enter a todo') {
      this.newTodo = '';
    }
  }

  createTodo() {
    const fields = {};
    fields[TODO_FIELD.fieldApiName] = this.newTodo;
    fields[COMPLETED_FIELD.fieldApiName] = this.completedFlag;
    const recordInput = {
      apiName: TODO_OBJECT.objectApiName,
      fields
    };
    createRecord(recordInput)
      .then(todo => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Todo Created',
            message: `Todo ${todo.fields.Name.value} created.`,
            variant: 'success'
          }),
        );
        // now publish the created event to the container
        this.dispatchEvent(new CustomEvent('create'));
      })
      .catch(error => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Something went wrong..',
            message: error.body.message,
            variant: 'error'
          })
        );
      });

    // do we fire another event to get the parent to rerender here?
    this.resetForm();
  }

  handleTodoChange(evt) {
    if (evt.target.value) {
      this.newTodo = evt.target.value;
    }
  }

  resetForm() {
    this.newTodo = 'Please enter a todo';
  }
}