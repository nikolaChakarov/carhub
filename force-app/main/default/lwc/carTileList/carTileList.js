import { LightningElement, wire } from 'lwc';
import getCars from '@salesforce/apex/CarController.getCars';

// Lightnin Message Service and a message channel;
import CARS_FILTERED_MESSAGE from '@salesforce/messageChannel/carsFiltered__c';
import { subscribe, MessageContext } from 'lightning/messageService';

export default class CarTileList extends LightningElement {
    cars;
    error;
    filters = {};
    carFilterSubscribtion;

    @wire(getCars, {filters: '$filters'})
    carsHandler({ data, error }) {
        if (data) {
            this.cars = data;
        }

        if(error) {
            console.error(error);
            this.error = error;
        }
    }

    /**Load context from LMS */
    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.subscribeHandler();
    }

    subscribeHandler() {
        this.carFilterSubscribtion = subscribe(this.messageContext, CARS_FILTERED_MESSAGE, (message) => this.
        handleFilterChanges(message));
    }

    handleFilterChanges(msg) {
        console.log(msg.filters);
        this.filters = {...msg.filters};
    }

    /**unsubscribe the message when we leave the component */
}