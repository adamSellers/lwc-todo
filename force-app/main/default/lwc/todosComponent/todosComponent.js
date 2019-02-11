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
  ShowToastEvent
} from 'lightning/platformShowToastEvent';

export default class TodosComponent extends LightningElement {
  @track searchString = '';
  @track complete = [];
  @track incomplete = [];
  allTodos = [];

  // setup the fields and objects as required
  todoFieldName = TODO_FIELD.fieldApiName;
  completeFieldName = COMPLETED_FIELD.fieldApiName;
  objectName = API_NAME.objectApiName;

  @wire(getTodos, {
    searchKey: '$searchString'
  })
  sendForSplitting({
    error,
    data
  }) {
    if (error) {
      this.error = error;
    } else if (data) {
      this.splitTodos(data);
    }
  }

  handleCompleteEvent(evt) {
    // firstly, filter the record from the all todos array
    let recordId = evt.detail;
    let updatedCompleteFlag = this.allTodos.filter(el => {
      return el.Id === recordId;
    })

    // flip the completed flag
    let completeFlag = !updatedCompleteFlag[0].Completed__c;
    // setup the record object 
    let newRecord = {
      apiName: this.objectName,
      fields: {
        [this.completeFieldName]: {
          value: completeFlag
        }
      },
      id: updatedCompleteFlag[0].Id
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
    console.log('split \'em!');
    // reset the complete and incomplete arrays
    this.incomplete = [];
    this.complete = [];
    this.allTodos = todos;
    this.allTodos.forEach(todo => {
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

        // now, update the tracked array to rerender the component
        this.allTodos.forEach((el) => {
          if (el.Id === record.id) {
            // set the new values in the all todos array
            el.Todo__c = record.fields.Todo__c.value;
            el.Completed__c = record.fields.Completed__c.value;
          }
        });
        console.log('this will not be seen by anyone, ever..');
        this.splitTodos(this.allTodos);
      });
  }
}