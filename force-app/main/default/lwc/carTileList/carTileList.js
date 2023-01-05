import { LightningElement, wire } from 'lwc';
import getCars from '@salesforce/apex/CarController.getCars';

// Lightnin Message Service and a message channel;
import CARS_FILTERED_MESSAGE from '@salesforce/messageChannel/CarsFiltered__c';
import CAR_SELECTED_MESSAGE from '@salesforce/messageChannel/CarSelected__c';
import { subscribe, MessageContext, publish, unsubscribe } from 'lightning/messageService';

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

    subscribeHandler() {
        this.carFilterSubscribtion = subscribe(this.messageContext, CARS_FILTERED_MESSAGE, (message) => this.
        handleFilterChanges(message));
    }

    handleFilterChanges(msg) {
        this.filters = {...msg.filters};
    }

    handleCarSelected(data) {
        const { detail } = data;

        publish(this.messageContext, CAR_SELECTED_MESSAGE, { id: detail })
    } 
    
    connectedCallback() {
        this.subscribeHandler();
    }
    
    /**unsubscribe the message when we leave the component */
    disconnectedCallback() {
        unsubscribe(this.carFilterSubscribtion);
        this.carFilterSubscribtion = null;
    }
}