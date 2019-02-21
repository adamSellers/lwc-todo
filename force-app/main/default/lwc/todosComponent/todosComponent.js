import {
  LightningElement,
  track,
  wire
} from 'lwc';
import API_NAME from '@salesforce/schema/Todo__c';
import TODO_FIELD from '@salesforce/schema/Todo__c.Todo__c';
import COMPLETED_FIELD from '@salesforce/schema/Todo__c.Completed__c';
import getTodos from '@salesforce/apex/TodoComponentHandler.getTodos';
import {
  updateRecord,
  generateRecordInputForUpdate,
  deleteRecord
} from 'lightning/uiRecordApi';
import {
  refreshApex
} from '@salesforce/apex';
import {
  ShowToastEvent
} from 'lightning/platformShowToastEvent';

export default class TodosComponent extends LightningElement {
  @track searchString = '';
  @track complete = [];
  @track incomplete = [];
  allTodos = [];

  // property for the wired todos result so it can be refreshed
  sendForSplittingResult;

  // setup the fields and objects as required
  todoFieldName = TODO_FIELD.fieldApiName;
  completeFieldName = COMPLETED_FIELD.fieldApiName;
  objectName = API_NAME.objectApiName;

  @wire(getTodos, {
    searchKey: '$searchString'
  })
  sendForSplitting(result) {
    this.sendForSplittingResult = result;
    if (result.error) {
      this.error = result.error;
    } else if (result.data) {
      this.splitTodos(result.data);
    }
  }

  handleCreate() {
    return refreshApex(this.sendForSplittingResult);
  }

  handleCompleteEvent(evt) {
    // firstly, filter the record from the all todos array
    let recordId = evt.detail.todoId;
    let updatedCompleteFlag = false;

    // if the context is complete, set the flag to true. Then update
    // the relevant view state
    if (evt.detail.context === 'complete') {
      updatedCompleteFlag = true;
    }
    // setup the record object 
    let newRecord = {
      apiName: this.objectName,
      fields: {
        [this.completeFieldName]: {
          value: updatedCompleteFlag
        }
      },
      id: recordId
    }
    // generate the update record as per 
    // https://developer.salesforce.com/docs/component-library/documentation/lwc/lwc.reference_update_record
    let updatedRecord = generateRecordInputForUpdate(newRecord);

    // call the record update function
    this.updateTodo(updatedRecord);
  }

  handleDeleteEvent(evt) {
    // call the deleterecord method and pass in the record id.
    let recordId = evt.detail;
    deleteRecord(recordId)
      .then(() => {
        let toast = new ShowToastEvent({
          title: 'Record Deleted',
          message: 'Record Id: ' + recordId + ' deleted.',
          variant: 'success'
        });
        this.dispatchEvent(toast);
        return refreshApex(this.sendForSplittingResult);
      });
  }

  handleSaveEvent(evt) {
    let newRecord = {
      apiName: this.objectName,
      fields: {
        [this.todoFieldName]: {
          value: evt.detail.todo
        }
      },
      id: evt.detail.todoId
    }
    // generate the update record as per 
    // https://developer.salesforce.com/docs/component-library/documentation/lwc/lwc.reference_update_record
    let recordToUpdate = generateRecordInputForUpdate(newRecord);

    // call the record update function
    this.updateTodo(recordToUpdate);
  }

  // function to take the array of all todos and split into complete and incomplete
  splitTodos(todos) {
    this.incomplete = [];
    this.complete = [];
    todos.forEach(todo => {
      if (todo.Completed__c) {
        // add to complete
        this.complete.push(todo);
      } else {
        // add to incomplete
        this.incomplete.push(todo);
      }
    });
  }

  updateTodo(recordToUpdate) {
    updateRecord(recordToUpdate)
      .then(record => {
        let toast = new ShowToastEvent({
          title: 'Record Updated',
          message: 'Congratulations, Todo ' + record.fields.Name.value + ' has been updated',
          variant: 'success'
        });
        this.dispatchEvent(toast);
        return refreshApex(this.sendForSplittingResult);
      });
  }
}