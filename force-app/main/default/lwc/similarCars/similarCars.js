import { LightningElement, api, wire } from 'lwc';
import getSimilarCars from '@salesforce/apex/CarController.getSimilarCars';
import { getRecord } from 'lightning/uiRecordApi';
import MAKE_FIELDS from '@salesforce/schema/Car__c.Make__c';

// Navigation
import { NavigationMixin } from 'lightning/navigation';

export default class SimilarCars extends NavigationMixin(LightningElement) {
    similarCars;

    @api recordId;
    @api objectApiName;

    @wire(getRecord, { recordId: '$recordId', fields: [MAKE_FIELDS]})
    car;
    

    fetchSimilarCars() {
        getSimilarCars({
            carId: this.recordId,
            makeType: this.car.data.fields.Make__c.value
        }) 
            .then(result => {
                this.similarCars = result;
                console.log(this.similarCars);
            })
            .catch(error => console.log(error))
    }


    handleViewDetailsClick(e) {
        const id = e.target.dataset.id;

        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: id,
                objectApiName: this.objectApiName,
                actionName: 'view'
            }
        })
    }

}